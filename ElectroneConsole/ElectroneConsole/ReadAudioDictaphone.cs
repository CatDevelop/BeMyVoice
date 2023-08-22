using NAudio.Lame;
using NAudio.Wave;

namespace ConsoleApp1;

public class ReadAudioDictaphone
{
    public void Read(ref int fileNumber)
    {
        // Создаем объект WasapiLoopbackCapture для захвата звука с системного аудио вывода
        var loopbackCapture = new WasapiLoopbackCapture();

        // Создаем объект LameMP3FileWriter для сохранения записанного аудио в формате MP3
        var outputFileName = $"{fileNumber}speakers.mp3";
        LameMP3FileWriter writer = null;

        // Обработчик события для записи аудио
        loopbackCapture.DataAvailable += (sender, e) =>
        {
            if (writer == null)
            {
                writer = new LameMP3FileWriter(outputFileName, loopbackCapture.WaveFormat, LAMEPreset.STANDARD);
            }

            writer.Write(e.Buffer, 0, e.BytesRecorded);
        };

        // Начинаем запись
        loopbackCapture.StartRecording();

        Console.WriteLine("Запись звука с динамика компьютера...");

        // Ждем 5 секунд
        Thread.Sleep(5000);

        // Останавливаем запись и освобождаем ресурсы
        loopbackCapture.StopRecording();

        writer?.Dispose();

        Console.WriteLine($"Запись завершена. Аудио сохранено в файл: {outputFileName}");
    }
}
