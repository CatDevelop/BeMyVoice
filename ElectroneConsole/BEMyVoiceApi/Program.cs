using BEMyVoiceApi;
using ElectroneConsole;

var builder = WebApplication.CreateBuilder(args);
var audio = new DyctothoneSender();
builder.Services.AddSingleton(audio);
builder.Services.AddControllers();

var app = builder.Build();


app.MapControllers();
app.UseCors(x =>
{
    x.AllowAnyMethod();
    x.AllowAnyOrigin();
    x.AllowAnyHeader();
});
var main = new Thread(app.Run);
var notMain = new Thread(audio.Start);

main.Start();
notMain.Start();