



# 청각장애인들을 위한 비대면 교육 플랫폼 개발

해당 프로젝트는 2022학년도 1학기 캡스톤 디자인 프로젝트 입니다.



## Contents
1. [Differentiation](#Differentiation)
2. [Team](#Team)
3. [Install](#Install)
4. [Requirements](#Requirements)
5. [Technology Stack](#Technology_Stack)
6. [Deep Learning](#DeepLearning-Model)
    - [Custom dataset](#Custom_dataset)
    - [Model & Hyper Parameters](#Model_&_Hyper_Parameters)
    - [Training](#Training)
    - [Result](#Result)
7. [FullStack](#Full_Stack)
    - [Front-End](#Front-End)
    - [Back-End](#Back-End)     
8. [Demonstration](#Demonstration )
   - [Main-Page](#Main-Page)
   - [Sub-Page](#Sub-Page)     
   - [Sign In & Sign Up](#Sign_In_&_Sign_Up)
   - [Live - Chat Room](#Live_-_Chat_Room)   
9. [WorkFlow](#WorkFlow)
10. [Timetable](#Timetable)
11. [Test document](#Test_document)
12. [Weekly work Report](#Weekly_work_Report)   



## 🌱 청각장애인들을 위한 비대면 교육 플랫폼 개발

코로나 19 사태로 인해 대부분의 초·중·고교에서 대면 수업과 온라인 수업을 진행하고 있다. 일반적인 대학교의 온라인 강의는 ZOOM이나 학교 자체 동영상 강의 플랫폼을 활용한다. 그러나 비대면 수업은 대부분 강사의 입이 화면에 나타나지 않거나 강의자료만 표시된다. 장애인차별법 14조는 교육관리자가 수어통역, 문자통역, 자막 등 의사소통 수단을 적극 고안/제공하도록 규정하고 있지만, 시간과 비용상 어려움이 있어 이 같은 지원이 어렵다. 따라서 이번 캡스톤 프로젝트를 통해 **청각장애인을 위한 음성 및 수화 번역 교육 플랫폼**을 만드는 것을 목표로 하고 있다. 기술 개발은 크게 두 가지로 나뉜다.

| <p align="center"><img src="./images/instructor_to_student.png" > | <p align="center"><img src="./images/student_to_instructor.png" > |
| ------------------------------------------------------------ | ------------------------------------------------------------ |




1) 실시간 전송되는 강사의 음성이 텍스트로 변환되어 화면에 전송한다.
2) 청각장애인의 수화를 텍스트로 변환해 화면에 전송한다. 

이 기술들은 STT API를 사용하고(1) 객체 감지를 위해 직접 구축한 수화 데이터 세트와 Darknet YOLOv4를 사용하여 구현된다(2). 이를 통해 **강의자와 청각장애인, 청각장애인과 강의자 사이의 원활한 의사소통**이 되도록 한다.



# Differentiation

기존의 화상 통화 플랫폼 중 가장 대중적인 ZOOM을 예로 들었을 때, 현재 ZOOM에서는 영어 자막만 지원하고 있으며 한국어는 지원하고 있지 않다. 또한, 수화 번역 기술이 없으며 해당 제품을 설치해야 화상통화에 참여가 가능하다. 본 프로젝트에서는 청각장애인 또한 활발하게 화상통화에 참여할 수 있도록 **수어 번역이 가능**하며, **실시간으로 한국어 자막을 제공**한다. 추가적으로 별다른 설치가 필요없이 참여 공간에 구애 받지 않고 **웹 브라우저에서 바로 구동이 가능**하며, **화상 플랫폼 내에서 파일 전송/다운이 가능**하다. 



# Team

시작은 시작이조 (The beginning is the beginning)

|Name|Department|Contact|
|---|---|---|
| Jung Hee Sun | Major of Bigdata | glee623@naver.com|
| Lee Ye Jin | Major of Bigdata | leeye0616@naver.com|
| Lee So Eun | Major of Bigdata | dlth508@naver.com  |
| Kim Gang Su | Major of Bigdata | gangsu1813@naver.com|



# Coach

|Name|Department|Contact|
|---|---|---|
| Hou Jong Uk | Hallym Univ (Prof.) | juhou@hallym.ac.kr|



# Install

```python
conda install -c conda-forge pyngrok  
conda install -c conda-forge flask-socketio  
conda install -c anaconda flask  
```



# Requirements

`Python 3.7 ~ 3.9`

`CUDA Version 11.2`

`cuddn 7.6.5`

`flask 2.0.3`

`flask-socketio 5.1.0`

`pyngrok 5.1.0`



# Technology Stack

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/> <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/><img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=Flask&logoColor=white"/><img src="https://img.shields.io/badge/socket.io-010101?style=flat-square&logo=socket.io&logoColor=white"/><img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=Bootstrap&logoColor=white"/><img src="https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=WebRTC&logoColor=white"/><img src="https://img.shields.io/badge/ngrok-1F1E37?style=flat-square&logo=ngrok&logoColor=white"/><img src="https://img.shields.io/badge/nvidia-76B900?style=flat-square&logo=nvidia&logoColor=white"/><img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=OpenCV&logoColor=white"/>



## API

`STT` 





# Deep Learning

## Custom dataset

More Details [custom dataset 구축](https://github.com/yetniek/2022-1_capstone_design/tree/main/dataset_codes) 

데이터 셋은 한국어 수화의 자음 14개, 모음 17개로 총 31개의 글자를 한 사람 당 50장씩 약 1,550장을 구축하였다. 총 다섯명의 인원이 데이터 셋을 수집하였고 data augmentation을 활용해 이미지를 약 3배 정도 늘려 **총 23,250장**의 데이터셋을 구축하였다. 또한, Vott(Visual Object Tagging Tool)를 활용하여 직접 라벨링 하였는데, 추가적인 데이터 셋을 구축할 때 Vott를 활용할 시 시간 소모가 커 라벨링을 자동화 시키기 위해 MediaPipe를 통해 손 부분에 바운딩 박스를 그려 마우스 클릭 시 해당 좌표를 저장하도록 설정해 데이터 라벨링을 진행하였다. 



<p align="center"><img src="./images/dataset_img.png">


## Result

![성능](./images/perform.png)



## Training

YOLO 모델의 결과로 class 번호를 얻고 사전에 정의해 둔 자음, 모음 딕셔너리를 통해 검출 결과를 한글 string 값으로 변환한다. 해당 프로젝트는 단순히 자음, 모음 출력값을 얻는 것이 아닌 검출된 자음, 모음을 모아 하나의 단어로 표현해야 하기 때문에 비어있는 큐를 만들어준 후 검출된 자음, 모음 값을 append 해주어 한 단어에 사용되는 자음, 모음이 하나의 큐에 담기도록 구성하였다. YOLO 모델 같은 경우, 실시간으로 사진에 대한 output을 출력하고 있기 때문에 동일한 output이 반복적으로 append 되는 문제가 생기는데, 조건을 주어 연속되는 자음, 모음  값을 1개만 append 되도록 하였다. None 출력 횟수를 count 하는 변수를 사용하여 None 값이 3개가 출력되는 경우 자음, 모음 큐를 하나의 list로 만들었다. 해당 list의 후처리를 통하여 자음, 모음 list를 하나의 단어로 구성하였다. 단어가 구성된 후에는 기존 큐를 빈 큐로 새로 할당해 주고 이어지는 다음 단어 검출을 시작하게 된다.





# Full Stack

More Details  [Sign-Language-Live-Chat](https://github.com/GangsuKim/sign-language-live-chat)

## Front-End

Socket.io와 WebRTC를 이용한 p2p 기반 실시간 화상 채팅 서비스를 개발하였다. 빠르게 진행되는 수화와 음성인식의 특성상 수직으로 수화 및 음성의 번역 채팅이 빠르게 전달되는 것을 사용자가 여유 있는 시간을 두고 인지 하고 반응 할 수 있도록 수평 구조로 음성 및 수화 번역 채팅을 표시하였다.

<br>

## Back-End

SIGN의 Back-end는 Python을 기반으로 구현된 deep-learning과의 연동을 위해 Python의 Flask 라이브러리와 Flask-socketio를 통해 Back-end를 구현하였다. Flask를 통해 Local 서버를 구현하고 Flask-socketio를 통해 Front-end와 Back-end와의 통신을 가능하게 하였다. 이후 기존의 Local 에서만 접속이 가능하던 한계를 보완하기 위해 ngrok를 이용하여 Local이 아닌 다른 PC 혹은 모바일 기기 에서도 접속이 가능하도록 구현하였다.

<br>





# Demonstration 

## Main Page

![](./images/main.png)



메인 화면의 좌측 상단에는 플랫폼의 이름이 적혀있고, 우측 상단에는 회원가입과 로그인을 할 수 있는 버튼이 있다. '지금 바로 시작하기' 버튼을 누르면 좌측 하단의 `Room name` 과 `sign` 으로 포커스가 이동한다. 

<br>



## Sub Page

![](./images/sub.png)

<br>



## Sign In & Sign Up

![](./images/sign_in.png)

​                                                                                       < 로그인 버튼을 누르면 나오는 화면 >

<br>

![](./images/sign_up.png)

​                                                                                                < 회원가입 화면 >

<br>

## Live - Chat Room

![](./images/input_name.png)

​                                                                                       < SIGN 버튼을 누르면 나오는 화면 >

<br>





![구현 화면](https://user-images.githubusercontent.com/52689918/170547204-82b6b14c-d8e5-40b6-99df-28b95ca04552.png)

​																					 < 화상 채팅 실행 화면 >

화상 채팅 실행 화면이다. 좌측에 화상 캠이 송출되고 User의 카메라가 상단에 위치한다. 좌측 하단에 캠과 마이크를 ON/OFF 할 수 있는 기능이 있으며 오른쪽 마우스 클릭 시 수어 통역 모드가 켜진다. 송출 화면 우측에는 번역된 수어가 나온다. 우측에는 사용자간의 채팅이 가능하고, 채팅 상단에 있는 클립 아이콘을 누르면 파일 전송/다운이 가능하다. 

<br>

### - Details

**카메라 옆 번역 box** : 해당 box는 음성 STT 번역 결과를 초록색 대화창으로, 수화 번역 결과를 보라색 대화창으로 출력한다.

**카메라 버튼 우클릭** : 수화 번역 기능을 on/off 할 수 있다.

**마이크 버튼 우클릭** : STT 기능(음성 자막기능)을 on/off 할 수 있다.

**채팅** : 채팅창을 통해 메세지를 보내고 받을 수 있으며 파일 전송 또한 가능하다.



# WorkFlow

<p align="center"><img src="./images/workflow.png" style="zoom:160%;" />

# Timetable

![일정](https://user-images.githubusercontent.com/52689918/170536139-7649f83a-36ce-49f0-85db-f04b58cd16e2.png)







# Test document

<p align="center"><img src="./images/test_report.PNG" style="zoom:100%;" />




# Weekly work Report

[Report Link](https://github.com/glee623/2022-1_capstone_design/tree/main/docs/weekly_report)
