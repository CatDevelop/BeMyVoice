namespace VoiceSender.ApiClient.dto;

public class UploadResponse
{
    public int status;
    public UploadResult UploadResult;
}

public class UploadResult
{
    public string request_file_id;
}