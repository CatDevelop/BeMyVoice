import requests


def normalize_text(text):
    url = "https://beta.saluteai.sberdevices.ru/v1/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIiwidHlwIjoiSldUIn0..RLiA-7uAexeGKGZi.DL_CeG-tNr-2HzRxqVmg-SxDHAePowdkseIp328YwEdFQ8ZkerAhPw3bRIi1nZUYM_eoINh2pK4.0IcHVKlADECX21DnXRkVhg"
    }
    # text = "Я бег быстро"
    data = {
        "model": "GigaChat:latest",
        "temperature": 0.87,
        "max_tokens": 2048,
        "messages": [
            {"role": "system", "content": f"Отвечай как грамотный умный человек"},
            {"role": "user", "content": f"Нормализуй текст без дополнительных вставок (либо только текст, либо прошлая версия): {text}"}
        ]
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()
        completions = result["choices"][0]["message"]["content"]

        completionsArray = completions.split(' ')
        notNormalizedArray = text.split(' ')

        if len(completionsArray) - len(notNormalizedArray) > 6:
            return text.title()+'.'
        else:
            return completions.replace('"', '').replace("'", '')
    else:
        print("Error:", response.status_code)
        print(response.text)
