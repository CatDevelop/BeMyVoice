using System.Text;
using ElectroneConsole;
using Microsoft.AspNetCore.Mvc;

namespace BEMyVoiceApi;

[ApiController]
[Route("public/")]
public class MainController: ControllerBase
{
    private StringBuilder allText = new ();
    private readonly DyctothoneSender _sender;
    private bool isFirst = true;
    
    public MainController(DyctothoneSender sender)
    {
        _sender = sender;
    }

    [HttpGet("get-services-result")]
    public IActionResult GetText()
    {
        return Ok(_sender.Text);
    }

    // public IActionResult Get()
    // {
    //     
    // }
}