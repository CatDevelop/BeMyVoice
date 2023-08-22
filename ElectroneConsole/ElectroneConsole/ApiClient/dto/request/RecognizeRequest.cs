using Newtonsoft.Json;

namespace VoiceSender.ApiClient.dto;

public class RecognizeRequest
{
    public Options options = new ();
    public string request_file_id;

    public RecognizeRequest(string requestFileId)
    {
        request_file_id = requestFileId;
    }
}

public class Options
{
    public string model = "general";
    public string audio_encoding = "MP3";
    public short sample_rate = 16000;
    public short channels_count = 1;
}