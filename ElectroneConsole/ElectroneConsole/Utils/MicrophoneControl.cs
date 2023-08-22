using NAudio.CoreAudioApi;

namespace VoiceSender.VoiceSender;

public class MicrophoneControl
{
    public static void Mute(bool changeMute)
    {
        var enumerator = new MMDeviceEnumerator();
        var devices = enumerator.EnumerateAudioEndPoints(DataFlow.Capture, DeviceState.Active);
        var micro = devices.FirstOrDefault(x => x.FriendlyName == "CABLE Output (VB-Audio Virtual Cable)");
        micro.AudioEndpointVolume.Mute = changeMute;
    }
}