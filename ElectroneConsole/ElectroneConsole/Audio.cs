// using System.Text;
// using ConsoleApp1;
// using ElectronCgi.DotNet;
// using VoiceSender.ApiClient;
//
// namespace ElectroneConsole;
//
// public class Audio
// {
//     private readonly SaluteSpeechClient _saluteSpeechClient;
//     private readonly ReadAudioDictaphone _audioDictaphone;
//     private readonly ReaderAudioMicrophone _audioMicrophone;
//     private readonly Connection _connection;
//     private static int _fileNumber = 1;
//     public StringBuilder MicroText = new();
//     public StringBuilder SpeakerText = new();
//
//     public Audio()
//     {
//         _saluteSpeechClient = new SaluteSpeechClient();
//         _audioDictaphone = new ReadAudioDictaphone();
//         _audioMicrophone = new ReaderAudioMicrophone();
//     }
//
//     public async Task MainTaskMicrophone()
//     {
//         _audioMicrophone.Read(_fileNumber);
//
//         var responseTask = RequestMicrophone();
//         var task = MainTaskMicrophone();
//         var response = await responseTask;
//         MicroText.Append(response);
//         await task;
//     }
//
//     public async Task MainTaskSpeakers()
//     {
//         _audioDictaphone.Read(ref _fileNumber);
//
//         var responseTask = RequestSpeakers();
//         var response = await responseTask;
//         await MainTaskSpeakers();
// //         var task = await MainTaskSpeakers(connection);
//
//         Console.WriteLine(response);
// //         await task;
//
//     }
//
//     public async Task<string> RequestMicrophone()
//     {
//         var path = $"{_fileNumber}microphone.mp3";
//         var response = await _saluteSpeechClient.VoiceToText(path);
//         _fileNumber++;
//         if (File.Exists(path))
//         {
//             File.Delete(path);
//         }
//         return response;
//     }
//
//     public async Task<string> RequestSpeakers()
//     {
//         var path = $"{_fileNumber}speakers.mp3";
//         var response = await _saluteSpeechClient.VoiceToText($"{_fileNumber}speakers.mp3");
//         _fileNumber++;
//         if (File.Exists(path))
//         {
//             File.Delete(path);
//         }
// //         _connection.Send("get-services-result", "123");
// //         Console.WriteLine( "START" + response + "END");
//         return response;
//     }
// }