import argparse
import base64
import json
import os
import time
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from queue import Queue
from threading import Thread

import cv2
import numpy as np
import socketio
from flask import Flask
from omegaconf import OmegaConf

from GigaChat_API import normalize_text
from model import Predictor

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

# Setting up the WebSocket server using Socket.IO
sio = socketio.Server(cors_allowed_origins="*", async_mode='threading')
# app = socketio.WSGIApp(sio)
app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# Create a deque to hold video frames with a maximum length of 32
frame_queue = deque(maxlen=32)
sign_res = []

room_id = 0


# Function to parse command-line arguments
def parse_args():
    parser = argparse.ArgumentParser(description='MMAction2 webcam demo')
    parser.add_argument('--config_path', default='static/config.json', help='model config')
    parser.add_argument(
        '--device', type=str, default='cpu', help='CPU/CUDA device option')
    parser.add_argument(
        '--camera-id', type=int, default=0, help='camera device id')
    parser.add_argument(
        '--sample-length',
        type=int,
        default=32,
        help='len of frame queue')
    parser.add_argument(
        '--drawing-fps',
        type=int,
        default=20,
        help='Set upper bound FPS value of the output drawing')
    parser.add_argument(
        '--inference-fps',
        type=int,
        default=4,
        help='Set upper bound FPS value of model inference')
    parser.add_argument(
        '--openvino',
        action='store_true',
        help='Use OpenVINO backend for inference. Available only on Linux')
    args = parser.parse_args()
    return args


# Resize and pad image while preserving aspect ratio.
def resize(im, new_shape=(224, 224)):
    shape = im.shape[:2]
    if isinstance(new_shape, int):
        new_shape = (new_shape, new_shape)

    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])

    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]

    dw /= 2
    dh /= 2

    if shape[::-1] != new_unpad:
        im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    im = cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(114, 114, 114))
    return im


# Initialize the ML model with configuration
def init_model(config_path):
    try:
        with open('C:\\Users\\User\\OneDrive\\Документы\\My works\\Projects\\BeMyVoice\\recognition\\config.json', "r") as read_content:
            config = json.load(read_content)
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found at path: {config_path}")
    except json.JSONDecodeError:
        raise ValueError(f"Error decoding the configuration file: {config_path}")

    try:
        cfg = OmegaConf.create(
            {
                "path_to_model": 'C:\\Users\\User\\OneDrive\\Документы\\My works\\Projects\\BeMyVoice\\recognition\\S3D.onnx',
                "path_to_class_list": 'C:\\Users\\User\\OneDrive\\Документы\\My works\\Projects\\BeMyVoice\\recognition\\RSL_class_list.txt',
                "threshold": 0.7,
                "topk": 1,
            }
        )
        model = Predictor(cfg)
        return model
    except KeyError as e:
        raise KeyError(f"Missing key in configuration file: {e}")
    except ValueError as e:
        raise ValueError(f"Error creating Predictor configuration: {e}")


# Function to perform model inference on video frames
def inference(model, frame_queue, result_queue):
    global room_id
    args = parse_args()
    last_sign_time = time.time()
    while True:
        cur_fps_time = time.time()

        if (time.time() - last_sign_time > 3 and len(sign_res) > 1) or len(sign_res) > 10:
            not_normalize_text = ' '.join(sign_res)

            # sio.emit("send_not_normalize_text", not_normalize_text, room=room_id)
            print(not_normalize_text)
            norm_text = normalize_text(not_normalize_text)
            print(norm_text)
            sio.emit("send_normalize_text", norm_text, room=room_id)
            print(room_id)
            last_sign_time = time.time()
            sign_res.clear()

        if len(frame_queue) >= args.sample_length:
            cur_windows = list(frame_queue)
        else:
            continue

        model_time = time.time()
        results = model.predict(cur_windows)
        if results:
            result_queue.put(results)
            print(results)
            label = results['labels'][0]
            if label == 'он/она/оно/они':
                label = 'он'
            if label == 'вы/твой/ваш':
                label = 'вы'
            print(label)

            if label != 'нет жеста':
                if len(sign_res) == 0:
                    sign_res.append(label)
                    last_sign_time = time.time()
                    sio.emit("send_not_normalize_text", label, room=room_id)
                elif sign_res[-1] != label:
                    sign_res.append(label)
                    last_sign_time = time.time()
                    sio.emit("send_not_normalize_text", label, room=room_id)

            # last_sign_time = time.time()
        model_fps = 1 / (time.time() - cur_fps_time)


def main():
    global frame_queue
    args = parse_args()
    model = init_model('C:\\Users\\User\\OneDrive\\Документы\\My works\\Projects\\BeMyVoice\\recognition\\config.json')
    data = dict(img_shape=None, modality='RGB', label=-1)
    cam_disp = {'cam': None}

    result_queue = Queue(maxsize=100)

    pr = Thread(target=inference, args=(model, frame_queue, result_queue), daemon=True)
    pr.start()

    # Use ThreadPoolExecutor to manage multiple concurrent tasks
    with ThreadPoolExecutor(max_workers=2) as executor:
        executor.submit(create_server)
        # executor.submit(inference, model, frame_queue, result_queue)

    while True:
        if cam_disp['cam'] is not None:
            cv2.imshow('cam', cam_disp['cam'])

        if cv2.waitKey(1) == ord('q'):
            break


# Socket.IO event handler: Client connects
@sio.event
def connect(sid, environ):
    global room_id
    print("Client connected:", sid)
    print(sid)
    room_id = sid


# @sio.on("test_event")
# def test_event(sid, data):
#     print("Received 'test_event' from client:", data)
#     sio.emit("test_response", "Test response", room=sid)


# Socket.IO event handler: Received video frame data from the client
@sio.on("data")
def data(sid, data):
    global frame_queue
    image_data = data.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    frame = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(frame, -1)
    frame_queue.append(np.array(resize(image, (224, 224))[:, :, ::-1]))


# Function to create the WebSocket server
def create_server():
    app.run()
    # eventlet.wsgi.server(eventlet.listen(("127.0.0.1", 8765)), app)


if __name__ == '__main__':
    main()
