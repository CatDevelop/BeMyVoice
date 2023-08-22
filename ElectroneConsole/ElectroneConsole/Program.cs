using ElectronCgi.DotNet;
using System.Text;
using ElectroneConsole;
using Muter;

class Program
{
    public static async Task Main()
    {
        var connection = new ConnectionBuilder().WithLogging(minimumLogLevel: Microsoft.Extensions.Logging.LogLevel.Trace).Build();
        // var audio = new Audio(connection);

//         connection.On<string, string>("recognize",(string x) => x});
//             connection.On<string, string>("recognize",response => {
//                 connection.Send("get_res", "111");
//                 return response;
//             });

        // connection.OnAsync("recording-services", async () =>
        // {
        //     await audio.MainTaskSpeakers();
        // });
        // await audio.RequestSpeakers();
        // connection.Listen();
    }
}