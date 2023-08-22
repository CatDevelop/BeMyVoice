using NAudio.Wave;
using VoiceSender.ApiClient;
using VoiceSender.VoiceSender;

namespace Muter;

public class SoundDevice
{
    public static async Task Play(string text, string voice)
    {
        var client = new SaluteSpeechClient();
        var waveIn = new WaveInEvent();
        
        var response = await client.TextToVoice(voice, text);
        var audioBytes = response.RawBytes;
        
        using var memoryStream = new MemoryStream(audioBytes);
        await using var rawStream = new RawSourceWaveStream(memoryStream, new WaveFormat(12000, 2));
        using var waveOut = new WaveOutEvent();
        
        MicrophoneControl.Mute(true);
        
        waveOut.Init(rawStream);
        waveIn.StartRecording();
        waveOut.Play();

        while (waveOut.PlaybackState == PlaybackState.Playing)
        {
            Thread.Sleep(500);
        }
        waveIn.StopRecording();
        
        MicrophoneControl.Mute(false);
    }
}