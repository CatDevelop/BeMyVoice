import pyaudio
import wave
import time

def generate_file():
    global count_file
    filename = f"{count_file}.wav"
    CHUNK_SIZE = 1024  # Adjust this according to your needs
    DURATION = 10  # Adjust the recording duration as needed

    with pyaudio.PyAudio() as p:
        try:
            # Get default input (microphone) device
            default_microphone = p.get_default_input_device_info()
        except OSError:
            print("Microphone device not available on the system. Exiting...")
            exit()

        print(f"Recording from: ({default_microphone['index']}) {default_microphone['name']}")

        wave_file = wave.open(filename, 'wb')
        wave_file.setnchannels(1)  # Mono audio
        wave_file.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wave_file.setframerate(44100)  # Standard audio sampling rate

        def callback(in_data, frame_count, time_info, status):
            wave_file.writeframes(in_data)
            return (in_data, pyaudio.paContinue)

        with p.open(format=pyaudio.paInt16,
                    channels=1,  # Mono audio
                    rate=44100,  # Standard audio sampling rate
                    frames_per_buffer=CHUNK_SIZE,
                    input=True,
                    input_device_index=default_microphone['index'],
                    stream_callback=callback
                    ) as stream:
            print(f"Recording {DURATION} seconds of audio to {filename}")
            time.sleep(DURATION)  # Blocking execution while recording

        wave_file.close()

generate_file()