namespace VoiceSender.ApiClient.dto;

public class RecognizeResponse
{
    public int status;
    public RecognizeResult RecognizeResult;
}

public class RecognizeResult
{
    public Guid id;
    public DateTimeOffset created_at;
    public DateTimeOffset updated_at;
    public string status;
}