using System.Text;
using System.Text.Json.Nodes;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using VoiceSender.ApiClient.dto;

namespace VoiceSender.ApiClient;

public class SaluteSpeechClient
{
    private const string AuthRoot = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
    private const string TextVoiceRoot = "https://smartspeech.sber.ru/rest/v1/text:synthesize";
    private const string VoiceTextUploadRoot = "https://smartspeech.sber.ru/rest/v1/data:upload";
    private const string VoiceTextRecognizeRoot = "https://smartspeech.sber.ru/rest/v1/speech:async_recognize";
    private const string VoiceTextStatusRoot = "https://smartspeech.sber.ru/rest/v1/task:get";
    private const string VoiceTextDownloadRoot = "https://smartspeech.sber.ru/rest/v1/data:download";
    private readonly RestClient _client;
    
    private ICollection<KeyValuePair<string, string>> AuthHeaders = new Dictionary<string, string>()
    {
        { "Authorization", "Bearer MjVkMjE5MmMtNzBlMC00N2QwLTkyYmYtZDBjMmRhYTlhMDE4OjRkMWRmNGE3LTFjYjYtNGI4Yy05MzgwLWFiOTk0ODBmZWY1Ng=="},
        { "RqUID", "6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e" },
        { "Content-Type", "application/x-www-form-urlencoded"}
    };
    
    private ICollection<KeyValuePair<string, string>> Headers = new Dictionary<string, string>()
    {
        { "Content-Type", "application/text"},
        { "RqUID", "6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e" },
    }; 

    public SaluteSpeechClient()
    {
        var clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
        _client = new RestClient(clientHandler);
        Authorize().GetAwaiter().GetResult();
    }
    
    private async Task Authorize()
    {
        var clientHandler = new HttpClientHandler();
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
        var client = new RestClient(clientHandler);
        var request = new RestRequest(AuthRoot, Method.Post);
        request.AddHeaders(AuthHeaders);
        request.AddParameter("scope", "SALUTE_SPEECH_CORP");
        request.AddParameter("authorization", "d764910a-e898-4279-b0ae-52108467104f");
        var response = await client.ExecuteAsync(request);
        Headers.Add(new("Authorization", $"Bearer {((AuthResponse)JsonConvert.DeserializeObject(response.Content, typeof(AuthResponse))).access_token}"));
    }

    public async Task<RestResponse> TextToVoice(string voice, string text)
    {
        var request = new RestRequest(TextVoiceRoot, Method.Post);
        request.AddHeaders(Headers);
        request.Parameters.AddParameter(new QueryParameter("voice", voice));
        request.AddBody(Encoding.UTF8.GetBytes(text));
        return await _client.ExecuteAsync(request);
    }

    public async Task<TextResponse> VoiceToText(string path)
    {
        var request = new RestRequest(VoiceTextUploadRoot, Method.Post);
        request.AddHeaders(Headers);
        request.AddFile("file", path);

        var response =  await _client.ExecuteAsync(request);
        var json = JObject.Parse(response.Content);
        return await RecognizeAsync((string)json["result"]["request_file_id"]);
    }

    private async Task<TextResponse> RecognizeAsync(string fileId)
    {
        var request = new RestRequest(VoiceTextRecognizeRoot, Method.Post);
        request.AddHeaders(Headers);
        var body = JsonConvert.SerializeObject(new RecognizeRequest(fileId));
        request.AddBody(body);
        var response = await _client.ExecuteAsync(request);
        var json = JObject.Parse(response.Content);
        return await GetTaskStatus((string)json["result"]["id"]);
    }

    private async Task<TextResponse> GetTaskStatus(string taskId)
    {
        var request = new RestRequest(VoiceTextStatusRoot);
        request.AddHeaders(Headers);
        request.AddParameter(new QueryParameter("id", taskId));
        var response = JObject.Parse((await _client.ExecuteAsync(request)).Content);
        var status = (string)response["result"]["status"];
        while (true)
        {
            if(status =="DONE")
                break;
            response = JObject.Parse((await _client.ExecuteAsync(request)).Content);
            status = (string)response["result"]["status"];
        }

        var fileId = (string)response["result"]["response_file_id"];
        return await DownloadText(fileId);
    }

    private async Task<TextResponse> DownloadText(string fileId)
    {
        var request = new RestRequest(VoiceTextDownloadRoot);
        request.AddHeaders(Headers);
        request.AddParameter(new QueryParameter("response_file_id", fileId));
        var response = await _client.ExecuteAsync(request);
        return GetNormalizedTextFromJson(response.Content);
    }

    private TextResponse GetNormalizedTextFromJson(string content)
    {
        var response = new StringBuilder();
        var json = JArray.Parse(content);
        var emotion = "";
        foreach (var jsonChild in json.Children<JObject>())
        {
            var results = (JArray)jsonChild["results"];
            var emotions = (JObject)jsonChild["emotions_result"];
            emotion = GetEmotion(emotions);
            foreach (var result in results.Children<JObject>())
            {
                response.Append((string)result["normalized_text"]);
            }
        }

        var textResponse = new TextResponse(response.ToString(), emotion);
        return textResponse;
    }

    private string GetEmotion(JObject emotions)
    {
        var positive = (double)emotions["positive"];
        var neutral = (double)emotions["neutral"];
        var negative = (double)emotions["negative"];

        if (positive > neutral && positive > negative)
            return "positive";
        if(negative > neutral && negative > positive)
            return "negative";
        return "neutral";
    }
}
