# YOLO 데이터셋 수집 코드

<p align="center"><img src="/img/mediapipe_log.jpg"><\p>

MediaPipe란 Google에서 제공하는 AI frame work로, 다음과 같은 랜드마크를 통해 손의 위치를 감지하는 역할을 한다.

<p align="center"><img src="/img/hand_landmarks.png"><\p>

해당 frame work를 통해 네모 박스로서 감지된 손의 영역을 검출 하고,  검출 영역의 좌표를 이용하여 YOLO 학습 데이터를 구성하였다.



### 코드 설명

* 먼저 sign_number변수를 통해 저장할 데이터의 class를 지정하여준다.

* 왼쪽 마우스 클릭을 통해  사진이 찍히게 되고, 검출된 손의 좌표를 xmin, ymin, xmax, ymax로 나타낸다. 

* 최종 csv에는 image, xmin, ymin, xmax, yma,x label값이 저장되게 된다.

* 주석된 코드를 통해 MediaPipe를 통해 그려지는 bounding box를 직접 확인할 수 있다.

  -->기존 Yolo labeing 프로그램은 사진을 찍은 후, 직접 bounding box를 그리는 과정이 필요하기 때문에약 2배의 시간이 소요되지만, 해당 코드는 사진을 찍음과 동시에 MediaPipe를 통해 bounding box 좌표를 얻을 수 있으므로 labeling 프로그램보다 약 2배의 시간을 절약할 수 있다.



