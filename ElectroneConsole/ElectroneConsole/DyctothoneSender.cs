using System.Net.Mime;
using System.Text;
using ConsoleApp1;
using ElectronCgi.DotNet;
using Newtonsoft.Json.Linq;
using VoiceSender.ApiClient;

namespace ElectroneConsole;

public class DyctothoneSender
{
    private readonly ReadAudioDictaphone _dictaphone;
    private readonly SaluteSpeechClient _saluteSpeechClient;
    public string Text;
    private int _fileName;

    public DyctothoneSender()
    {
        _dictaphone = new ReadAudioDictaphone();
        _saluteSpeechClient = new SaluteSpeechClient();
    }

    public void Start()
    {
        while (true)
        {
            Console.WriteLine(_fileName);
            _dictaphone.Read(ref _fileName);
            RequestSpeakers().GetAwaiter().GetResult();
        }
    }
    
    private async Task RequestSpeakers()
    {
        Console.WriteLine("re" + _fileName);
        var path = $"{_fileName}speakers.mp3";
        var response = await _saluteSpeechClient.VoiceToText($"{_fileName}speakers.mp3");
        _fileName++;
        if (File.Exists(path))
        {
            File.Delete(path);
        }

        Console.WriteLine(response.Text);
        Console.WriteLine(response.Emotion);
        Text = JObject.FromObject(response).ToString();
    }
}