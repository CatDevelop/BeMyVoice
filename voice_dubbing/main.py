import argparse
import sounddevice as sd
import numpy as np
import requests as requests

authorize_root = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
authorize_headers = {
    'Authorization': 'Bearer Mzc2ZjNiNDMtMDEyMi00MTZkLWI2NzItNDc0ZTQ4NDAxMWQ3OmQ3NjQ5MTBhLWU4OTgtNDI3OS1iMGFlLTUyMTA4NDY3MTA0Zg==',
    'RqUID': '6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e'
}

root = 'https://smartspeech.sber.ru/rest/v1/text:synthesize'
params = {
    'format': 'wav16'
}
headers = {
    'Content-Type': 'application/text',
    'RqUID': '6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e'
}

def authorize():
    global token
    response = requests.post(authorize_root, headers=authorize_headers, data={
        'scope': 'SALUTE_SPEECH_PERS',
        'authorization': 'd764910a-e898-4279-b0ae-52108467104f',
        'rquid': '6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e'
    }, verify=False)
    try:
        return response.json()['access_token']
    except:
        print("Authorize error")


def synthesize(token:str, voice:str, text:str):
    try:
        headers["Authorization"] = f'Bearer {token}'
        params['voice'] = voice
        voice = requests.post(root, params=params, data=text.encode('utf-8'), headers=headers, verify=False)
        say(voice.content)
    except:
        print("sythesize error")


def say(content):
    audio_array = np.frombuffer(content, dtype=np.int16)
    sd.play(audio_array, samplerate=22000)
    sd.wait()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", required=True)
    parser.add_argument("--text", required=True)

    args = parser.parse_args()
    text = args.text
    voice = args.voice
    synthesize(authorize(), voice, text)


if __name__ == '__main__':
    main()


