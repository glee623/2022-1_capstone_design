from http import server
import re
from socket import socket
from textwrap import wrap
from turtle import delay
from flask import Flask,render_template,request  # 서버 구현을 위한 Flask 객체 import
from pyngrok import ngrok ,conf # 외부 접속 링크 생성
from flask_socketio import SocketIO, join_room, emit
import base64
from datetime import datetime
import ssl
import csv
import cv2
import time
from unicode import join_jamos
import cv2
import numpy as np
import io
from PIL import Image
from collections import deque

# users = []

serverActive = False

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

########################
string_list = {0: 'ㄱ', 1: 'ㄴ', 2: 'ㄷ', 3: 'ㄹ', 4: 'ㅁ', 5: 'ㅂ', 6: 'ㅅ', 7: 'ㅇ', 8: 'ㅈ', 9: 'ㅊ', 10: 'ㅋ', 11: 'ㅌ',
                   12: 'ㅍ', 13: 'ㅎ', 14: 'ㅏ', 15: 'ㅑ', 16: 'ㅓ', 17: 'ㅕ', 18: 'ㅗ', 19: 'ㅛ', 20: 'ㅜ', 21: 'ㅠ', 22: 'ㅡ',
                   23: 'ㅣ', 24: 'ㅐ', 25: 'ㅒ', 26: 'ㅔ', 27: 'ㅖ', 28: 'ㅚ', 29: 'ㅟ', 30: 'ㅢ'}
finger_queue = deque([])
compare_class = None
none_counter = 0
changed_class = None
final_word = None
tmp_cnt = 0

# YOLO 가중치 파일과 CFG 파일 로드
YOLO_net = cv2.dnn.readNet("C:/Users/soeun/PycharmProjects/_sign-language-live-chat-main/yolov4-obj_best.weights",
                           "C:/Users/soeun/PycharmProjects/_sign-language-live-chat-main/yolov4-obj.cfg")

# YOLO NETWORK 재구성
with open("C:/Users/soeun/PycharmProjects/_sign-language-live-chat-main/obj.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]
layer_names = YOLO_net.getLayerNames()
output_layers = [layer_names[i - 1] for i in YOLO_net.getUnconnectedOutLayers()]
#######################

@app.route("/")
def hello_world():
    global serverActive
    if not serverActive:
        conf.get_default().auth_token = "29FM13u5ZEJ3W3XG7V2I1qFeuef_sQ7UKU6wUQDSKaNY9P8A"
        conf.get_default().region = "jp"
        http_tunnel = ngrok.connect(5000)
        tunnels = ngrok.get_tunnels()

        for kk in tunnels:
            print(kk)

        serverActive = True

    return render_template('index.html')

@app.route("/signUp")
def signUp():
    return render_template('signUp.html')

@app.route("/room")
def room():
    return render_template('room.html')

@app.route("/story")
def story():
    return render_template('ourStory.html')

# SOCKET.IO
@socketio.on('join_room')
def joinRoom(data):
    join_room(data['roomName'])
    emit('welcome',data, broadcast=True, to=data['roomName'], include_self=False)
    return

# Work after somone in
@socketio.on('offer')
def sendOffer(data,roomName):
    emit('offer', data, broadcast=True, to=roomName, include_self=False)
    return

@socketio.on('answer')
def asnwer(data,roomName):
    emit('answer', data, broadcast=True, to=roomName, include_self=False)
    return

@socketio.on('ice')
def ice(data,roomName):
    # print(data) # for Debug
    emit('ice', data, broadcast=True, to=roomName, include_self=False)
    return

# TTS Data receive
@socketio.on('sendTTS')
def getTTS(ttsData,roomName):
    emit('streamTTS', ttsData, broadcast=True, to=roomName, include_self=True)
    return

@socketio.on('disconnect')
def disconnecting():
    # delay(500);
    emit('userLeft',request.sid, broadcast=True, include_self=False)
    return

@socketio.on('connect')
def someoneJoin():
    emit('returnMyId', request.sid, broadcast=True, include_self=True, to=request.sid)
    return

@socketio.on('user_message')
def userMessage(data,roomName):
    emit('user_message_from', data, broadcast=True, to=roomName, include_self=False)
    return

@socketio.on('SignUp')
def signUp(data):
    # Check ID Exist
    status = 'NotExist'
    with open('./database/user.csv','r',encoding='utf-8') as f:
        rdr = csv.reader(f)
        for line in rdr:
            if(line[0] == data['signId']):
                emit('SignUpRes', 'IDExist', to=request.sid, include_self=True)
                return

    with open('./database/user.csv','a', encoding='utf-8', newline='') as f:
        wr = csv.writer(f)
        wr.writerow([data['signId'], data['signPw'], data['signName'], data['signBirth']])
    
    emit('SignUpRes', 'DONE', to=request.sid, include_self=True)
    return

@socketio.on('SignIn')
def signIn(data):
    # print(data)
    with open('./database/user.csv','r',encoding='utf-8') as f:
        rdr = csv.reader(f)
        for line in rdr:
            if(line[0] == data['signId'] and line[1] == data['signPw']):
                emit('SignInRes', {'states':'Success', 'userId': data['signId'], 'userName':line[2]}, to=request.sid, include_self=True)
                return
    emit('SignInRes', {'states':'Fail'}, to=request.sid, include_self=True)
    return

@socketio.on('IDExist')
def IDExist(id):
    status = 'NotExist'
    with open('./database/user.csv','r',encoding='utf-8') as f:
        rdr = csv.reader(f)

        for line in rdr:
            if(line[0] == id):
                status = 'Exist'
    
    emit('resIDExist', status, to=request.sid, include_self=True)
    return


@socketio.on('onMuteChange')
def onMuteChange(data, roomName):
    emit('res_onMuteChange', data, broadcast=True, to=roomName, include_self=False)
    return

@socketio.on('fileUpload')
def fileUpload(data):
    path = "./static/files/"
    # print(data)
    with open(path + data['fileNameHash'] + '_' + data['fileName'], 'wb') as f:
        f.write(data['file']['file'])
    emit('userSendFile', data, broadcast=True, to=data['roomName'], include_self=False)
    return

@socketio.on('signImage')
def signImage(data):
    start = time.time()
    global string_list, finger_queue, compare_class, compare_class, none_counter, changed_class
    global final_word
    global YOLO_net
    global tmp_cnt

    userImage = data['userImage']  # 추가 => 사용자 이름 전달을 위해 추가
    userImage = userImage + '=' * (4 - len(userImage) % 4)
    userImage = userImage.replace('\n', '')
    userImage = userImage.replace("data:image/png;base64,", '')

    img = base64.b64decode(userImage)
    imgByte = io.BytesIO(img)
    img = Image.open(imgByte)
    img = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)

    h, w, c = img.shape

    # YOLO 입력
    yolo_start = time.time()
    blob = cv2.dnn.blobFromImage(img, 0.00392, (256, 256), (0, 0, 0), True, crop=False)  # resize 해보기 (200, 200)
    YOLO_net.setInput(blob)
    outs = YOLO_net.forward(output_layers)
    yolo_end = time.time() - yolo_start

    class_ids = []
    confidences = []
    boxes = []

    # outs가 감지한 개수.
    for out in outs:
        for detection in out:

            # print(detection)
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > 0.5:
                # Object detected
                center_x = int(detection[0] * w)
                center_y = int(detection[1] * h)
                dw = int(detection[2] * w)
                dh = int(detection[3] * h)
                # Rectangle coordinate
                x = int(center_x - dw / 2)
                y = int(center_y - dh / 2)
                boxes.append([x, y, dw, dh])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.45, 0.4)
    final_output = None

    for i in range(len(boxes)):
        if i in indexes:
            final_output = str(classes[class_ids[i]])
    print(final_output)
    '''
    연속적으로 들어오는 번역된 output을 처리하는 부분
    '''

    # 손 미검출시 None error 예외처리
    if final_output is not None:
        final_output = string_list[int(final_output)]
    else:
        pass

    # none_counter 개수가 5개보다 작을때 실행
    if none_counter < 3:
        # final_output이 None이 아니고, 이전 output인 compare_class와
        # 현재 class인 final_output이 다를때 finger_queue에 추가
        if final_output is not None and compare_class != final_output:
            finger_queue.append(final_output)
            compare_class = final_output
            none_counter = 0
        else:  # final_output이 None일때 실행
            # compare_class = None
            if final_output is None:
                none_counter += 1
                compare_class = None
            else:
                pass
        print('finger_queue:', finger_queue)
    # none_counter 개수가 5개보다 클때 실행
    else:
        final_word = list(finger_queue)
        none_counter = 0
        finger_queue = deque([])

    end = time.time() - start

    # print("WorkingTime: {} sec".format(end- start))
    # print('none cnt:', none_counter)
    # print('compare class:', compare_class)
    print('final_word:', final_word)
    print('yolo_time : ', yolo_end)
    print('total time : ', end)
    # Add POINT START
    if final_word is not None and final_word and len(final_word) != 1:
        join = join_jamos(''.join(final_word))
        print('join:', join)
        emit('streamSIGN', {'userId': data['userId'], "userText": join}, broadcast=True, to=data['roomName'],
             include_self=True)
        final_word = None
    else:
        pass

    print('###########################################')
    return

@socketio.on_error()
def chat_error_handler(e):
        print('An error has occurred: ' + str(e))

if __name__ == "__main__":
    socketio.run(app, debug=True)