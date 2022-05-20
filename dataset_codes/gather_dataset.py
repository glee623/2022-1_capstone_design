import cv2
import mediapipe as mp
import numpy as np
import os
import pandas as pd

global img, x1, x2, y1, y2, cnt, csv_list
sign_number = 31
cnt = 0
os.makedirs(f'./data/{sign_number}', exist_ok = True)
#####

max_num_hands = 1

# MediaPipe hands model
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(
    max_num_hands=max_num_hands,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5)


csv_list = {'image':[], 'xmin':[], 'ymin':[], 'xmax':[], 'ymax':[],'label':[]}

cap = cv2.VideoCapture(0)


def click(event, x, y, flags, param):
    global cnt, x1, x2, y1, y2
    if event == cv2.EVENT_LBUTTONDOWN:
        cv2.imwrite(f'./data/{sign_number}/sign_{sign_number}_{cnt}_h.jpg', img)
        csv_list['image'].append(f'sign_{sign_number}_{cnt}_h.jpg')
        csv_list['xmin'].append(x1)
        csv_list['ymin'].append(y1)
        csv_list['xmax'].append(x2)
        csv_list['ymax'].append(y2)
        csv_list['label'].append(sign_number)
        cnt += 1
        if cnt >50:
            print('complete')

cv2.namedWindow('Dataset')
cv2.setMouseCallback('Dataset', click)

while cap.isOpened():
    ret, img = cap.read()

    img = cv2.flip(img, 1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    result = hands.process(img)

    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    if result.multi_hand_landmarks is not None:
        for res in result.multi_hand_landmarks:
            joint = np.zeros((21, 3))
            for j, lm in enumerate(res.landmark):
                joint[j] = [lm.x, lm.y, lm.z]

            x1, y1 = tuple((joint.min(axis=0)[:2] * [img.shape[1], img.shape[0]] * 0.95).astype(int))
            x2, y2 = tuple((joint.max(axis=0)[:2] * [img.shape[1], img.shape[0]] * 1.05).astype(int))

            # # 좌표가 잘 구해졌는지 사각형 그려보기
            # cv2.rectangle(img, pt1=(x1, y1), pt2=(x2, y2), color=255, thickness=2)
            # mp_drawing.draw_landmarks(img, res, mp_hands.HAND_CONNECTIONS)


    cv2.imshow('Dataset', img)
    if cv2.waitKey(1) == ord('q'):
        break

csv_ = pd.DataFrame(csv_list)
csv_.to_csv(f'data/{sign_number}/capstone_sign_{sign_number}.csv', index = False)
