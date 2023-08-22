// using ConsoleApp1;
// using VoiceSender.ApiClient;
//
// namespace ElectroneConsole;
//
// public class MicrophoneSender
// {
//     private readonly ReaderAudioMicrophone _dictaphone;
//     private readonly SaluteSpeechClient _saluteSpeechClient;
//     public string Text;
//     
//     private int _fileName;
//
//     public MicrophoneSender()
//     {
//         _dictaphone = new ReaderAudioMicrophone();
//         _saluteSpeechClient = new SaluteSpeechClient();
//     }
//
//     public void Start()
//     {
//         while (true)
//         {
//             Console.WriteLine(_fileName);
//             _dictaphone.Read(ref _fileName);
//             RequestSpeakers().GetAwaiter().GetResult();
//         }
//     }
//     
//     private async Task RequestSpeakers()
//     {
//         Console.WriteLine("re" + _fileName);
//         var path = $"{_fileName}speakers.mp3";
//         var response = await _saluteSpeechClient.VoiceToText($"{_fileName}speakers.mp3");
//         _fileName++;
//         if (File.Exists(path))
//         {
//             File.Delete(path);
//         }
//
//         Console.WriteLine(response);
//         Text = response;
//     }
// }