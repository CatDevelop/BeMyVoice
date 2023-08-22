using System.Text;

namespace VoiceSender.ApiClient;

public class TextResponse
{
    public string Text;
    public string Emotion;

    public TextResponse(string text, string emotion)
    {
        Text = text;
        Emotion = emotion;
    }
}