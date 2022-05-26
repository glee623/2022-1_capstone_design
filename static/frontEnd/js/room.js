// NEW VERSION
const socket = io(); // Socket.io 

const myFace = document.getElementById("myFace"); //
const muteBtn = document.getElementById("myAudioStat"); //
const cameraBtn = document.getElementById("myVideoStat"); //
const camerasSelect = document.getElementById("cameras");
const audiosSelect = document.getElementById("audios");
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");
const footBar = document.getElementById('footBar');
const myName = document.getElementById('myName');
const rightBar = document.getElementById('rightBar');

let myStream;
let muted = false;
let cameraOff = false;
let roomName, userName, userId;
let myPeerConnection = new Object();
let isSTTEnabled = false;

// Get SID from backend
socket.on('returnMyId', sid => {
    userId = CryptoJS.SHA256(sid).toString();
});

async function getCameras() { // 카메라의 목록 불러오기
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind == "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label.split(' (')[0];

            if (currentCamera.label === camera.label) {
                option.selected = true;
                option.innerText = '[기본] ' + option.innerText;
            }
            camerasSelect.appendChild(option);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getAudios() { // 오디오 목록 불러오기
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter(device => device.kind == "audioinput");
        const currentAudio = myStream.getAudioTracks()[0];
        console.log(audios);
        var ticker = 0;
        audios.forEach(audio => {
            const option = document.createElement("option");
            option.value = audio.deviceId;
            option.innerText = audio.label.split(' (')[0];
            
            if (currentAudio.label === audio.label) {
                option.selected = true;
                option.innerText = '[기본] ' + option.innerText;
            }
            audiosSelect.appendChild(option);
        })
    } catch (e) {
        console.log(e);
    }
}

async function isAudioExist() {
    var micCnt = 0;
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter(device => device.kind == "audioinput");

        micCnt = mics.length;
    } catch (e) {
        console.log(e);
    }
    return micCnt == 0 ? false : true;
}

let currentAudioID = '';
let currentVideoID = '';

async function getMeida(deviceId, audioID) {
    var audioTF = true;
    if (!isAudioExist()) {
        audioTF = false;
    }

    // NEW
    let audioConst = audioTF;
    let videoConst = {facingMode: "user"};

    if(audioID) {
        audioConst = {deviceId: {exact: audioID}};
    } else if(currentAudioID !== '') {
        audioConst = {deviceId: {exact: currentAudioID}};
    }
     
    if(deviceId) {
        videoConst = {deviceId: {exact: deviceId}};
    } else if(currentVideoID !== '') {
        videoConst = {deviceId: {exact: currentVideoID}};
    }

    const univConstreins = {
        audio: audioConst,
        video: videoConst,
    }

    try {
        myStream = await navigator.mediaDevices.getUserMedia(univConstreins);

        myFace.srcObject = myStream;

        if (!deviceId && currentVideoID === '') {
            await getCameras();
        }

        if(!audioID && currentAudioID === '') {
            await getAudios();
        }
    } catch (e) {
        console.log(e);
    }
}

const main = document.getElementsByTagName('main')[0];
const right_click_camera = document.getElementById('right_click_camera');
const right_click_audio = document.getElementById('right_click_audio');

function handleMuteClick() {
    myStream.getAudioTracks().forEach((track) => (track.enabled = (track.enabled) ? false : true));
    const micIcon = muteBtn.getElementsByTagName('i')[0];

    if (!muted) {
        micIcon.setAttribute('class', 'bi bi-mic-mute-fill');
        muted = true;
    } else {
        micIcon.setAttribute('class', 'bi bi-mic-fill');
        muted = false;
    }

    socket.emit("onMuteChange", {muted: muted,userID: userId}, roomName);
    const RC_audio_muteClick = document.getElementById('RC_audio_muteClick');
    RC_audio_muteClick.innerText = (muted) ? '마이크 음소거 해제' : '마이크 음소거';
    right_click_audio.hidden = true;
}

function handleCameraClick() {
    myStream.getVideoTracks().forEach((track) => (track.enabled = (track.enabled) ? false : true));
    const cameraIcon = cameraBtn.getElementsByTagName('i')[0];

    if (cameraOff) {
        myStream.getVideoTracks().forEach((track) => (track.enabled = true));
        cameraIcon.setAttribute('class', 'bi bi-camera-video-fill');
        cameraOff = false;
    } else {
        myStream.getVideoTracks().forEach((track) => (track.enabled = false));
        cameraIcon.setAttribute('class', 'bi bi-camera-video-off-fill');
        cameraOff = true;
    }

    // Right Click Div
    const RC_Camera_muteClick = document.getElementById('RC_Camera_muteClick');
    RC_Camera_muteClick.innerText = (cameraOff) ? '카메라 켜기' : '카메라 끄기';
    right_click_camera.hidden = true;
}

main.addEventListener('click', (e) => {
    if(e.path.indexOf(right_click_camera) == -1) {
        right_click_camera.hidden = true;
    }
    
    if (e.path.indexOf(right_click_audio) == -1) {
        right_click_audio.hidden = true;
    }
})

function handleCameraRightClick(e) {
    e.preventDefault();
    right_click_camera.hidden = false;
    right_click_audio.hidden = true;
    right_click_camera.style.top = e.clientY + 'px';
    right_click_camera.style.left = e.clientX + 'px';
}

function handleMicRightClick(e) {
    e.preventDefault();
    right_click_audio.hidden = false;
    right_click_camera.hidden = true;
    right_click_audio.style.top = e.clientY + 'px';
    right_click_audio.style.left = e.clientX + 'px';
}

function sttToggle(obj) {
    if (isSTTEnabled) {
        stopReco();
        obj.innerText = '음성인식 켜기';
        isSTTEnabled = false;
    } else {
        startReco();
        obj.innerText = '음성인식 끄기';
        isSTTEnabled = true;
    }
    right_click_audio.hidden = true;
}

// Solving mic errors when camera change
function changeOnHandle() {
    const micIcon = muteBtn.getElementsByTagName('i')[0];
    const cameraIcon = cameraBtn.getElementsByTagName('i')[0];

    if (muted) {
        myStream.getAudioTracks().forEach((track) => (track.enabled = false));
        micIcon.setAttribute('class', 'bi bi-mic-mute-fill');
    } else {
        myStream.getAudioTracks().forEach((track) => (track.enabled = true));
        micIcon.setAttribute('class', 'bi bi-mic-fill');
    }

    if (cameraOff) {
        myStream.getVideoTracks().forEach((track) => (track.enabled = false));
        cameraIcon.setAttribute('class', 'bi bi-camera-video-off-fill');
    } else {
        myStream.getVideoTracks().forEach((track) => (track.enabled = true));
        cameraIcon.setAttribute('class', 'bi bi-camera-video-fill');
    }
}

async function handleCameraChange() {
    await getMeida(camerasSelect.value, null); // For my self
    const videoTrack = myStream.getVideoTracks()[0];
    Object.keys(myPeerConnection).forEach(sid => {
        const videoSender = myPeerConnection[sid].getSenders().find(sender => sender.track.kind == "video");
        videoSender.replaceTrack(videoTrack);
    });
    changeOnHandle();
}

async function handleAudioChange() {
    console.log(audiosSelect.value);
    await getMeida(null,audiosSelect.value);
    const audioTrack = myStream.getAudioTracks()[0]; // Currnet Audio track
    Object.keys(myPeerConnection).forEach(sid => {
        const audioSender = myPeerConnection[sid].getSenders().find(sender => sender.track.kind == "audio");
        audioSender.replaceTrack(audioTrack);
    });
    changeOnHandle();
}

muteBtn.addEventListener("click", handleMuteClick);
muteBtn.addEventListener("contextmenu", handleMicRightClick, false);
cameraBtn.addEventListener("click", handleCameraClick);
cameraBtn.addEventListener('contextmenu', handleCameraRightClick, false);
camerasSelect.addEventListener("input", handleCameraChange);
audiosSelect.addEventListener("input", handleAudioChange);


async function intiCall() {
    await getMeida();
    makeConnection(userId, userName);
    // startReco();
}

socket.on("welcome", async (data) => { // new person joined // [R-1] from 'join_room'
    makeConnection(data['userID'], data['userName']);
    console.log('New user join : ' + data['userID']);
    const offer = await myPeerConnection[data['userID']].createOffer();
    myPeerConnection[data['userID']].setLocalDescription(offer);
    console.log("Sent offer");
    userStateChange(data['userName'], 'join')
    socket.emit("offer", {
        offer: offer,
        userID: userId,
        userName: userName
    }, roomName);
});

socket.on("offer", async (data) => { // offer from exist users
    console.log("Recevied offer");
    if (myPeerConnection[data['userID']] === undefined) {
        makeConnection(data['userID'], data['userName']);
    }
    myPeerConnection[data['userID']].setRemoteDescription(data['offer']);
    const answer = await myPeerConnection[data['userID']].createAnswer();
    myPeerConnection[data['userID']].setLocalDescription(answer);
    socket.emit("answer", {
        answer: answer,
        userID: userId
    }, roomName);
    console.log("Sent the answer");
})

socket.on("answer", async (data) => { // answer from new user
    console.log("Recevied the answer");
    await myPeerConnection[data['userID']].setRemoteDescription(data['answer']);
});

socket.on("ice", async (data) => {
    console.log("Recevied Candidate");
    if (myPeerConnection[data['userID']]['iceConnectionState'] != 'connected') {
        console.log('Add ice to ' + data.userID);
        await myPeerConnection[data['userID']].addIceCandidate(data['ice']);
    }
});

// User Left from room
socket.on("userLeft", function (sid) {
    const videoFaces = call.querySelectorAll('.userView');
    const cryptoSID = CryptoJS.SHA256(sid).toString();
    videoFaces.forEach(videos => {
        if (videos['id'] == cryptoSID) {
            call.removeChild(videos);
            userStateChange(myPeerConnection[cryptoSID]['userName'], 'left');
        }
    });
    delete myPeerConnection[cryptoSID];
});

// RTC
function makeConnection(senderID, userName) {
    myPeerConnection[senderID] = new RTCPeerConnection({
        iceServers: [{
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ],
        },],
    });
    myPeerConnection[senderID]['userID'] = senderID;
    myPeerConnection[senderID]['userName'] = userName;
    myPeerConnection[senderID].addEventListener("icecandidate", handleIce);
    myPeerConnection[senderID].addEventListener("connectionstatechange", onConnectChange);
    myPeerConnection[senderID].addEventListener("track", handleTrack);
    myStream.getTracks().forEach(track => myPeerConnection[senderID].addTrack(track, myStream));
}

function handleIce(data) {
    console.log("Sent ICE");
    socket.emit("ice", {
        ice: data.candidate,
        userID: userId
    }, roomName);
}

function handleTrack(data) {
    console.log("handle track");
    let work = true;
    const videos = document.getElementsByTagName('video');
    console.log(videos);

    if (videos.length != 2) {
        videos.forEach(video => {
            if (video.id == this['userID'] && video.length == myPeerConnection.length) {
                work = false;
            }
        });
    }

    // 신규 유저 생성
    if (work) {
        const cloneUserDiv = document.getElementById('newUserCloneDiv').cloneNode(true);
        
        cloneUserDiv.hidden = false;
        cloneUserDiv.id = this['userID'];
    
        const userNameDiv = cloneUserDiv.querySelector('.userName');
        console.log(userNameDiv);
        userNameDiv.innerHTML = this['userName'] + userNameDiv.innerHTML;

        const video = cloneUserDiv.querySelector('video');
        video.id = this['userID'];
        video.srcObject = data.streams[0];

        console.log(data);
    
        const userList = document.getElementsByClassName('userList')[0];
        console.log(userList)
        userList.appendChild(cloneUserDiv);
    }
}

// Video to Photo
const photo = document.getElementById('photo');
const photoBtn = document.getElementById('capImage');

function capturePhoto() {
    const canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 300;
    context.drawImage(myFace, 0, 0, 400, 300);

    var image = canvas.toDataURL('image/png');
    socket.emit("signImage", {userImage: image, userId: userId, roomName: roomName}); // Emit base64 Image
}

let isSignON = false;
let capturePhotoInterval;

function signToggle(obj) {
    if(isSignON) {
        clearInterval(capturePhotoInterval);
        obj.innerHTML = '수화 인식 켜기';
        isSignON = false;
    } else {
        capturePhotoInterval = setInterval(capturePhoto, 1000);
        obj.innerHTML = '수화 인식 끄기';
        isSignON = true;
    }
    right_click_camera.hidden = true;
}

// User left at safari or other browsers
function onConnectChange(event) {
    const videoFaces = call.querySelectorAll('.userView');
    if (this.connectionState == 'disconnected' || this.connectionState == 'failed') {
        videoFaces.forEach(videos => {
            if (videos['id'] == this['userID']) {
                call.removeChild(videos);
                userStateChange(this['userName'], 'left');
            }
        });
        delete myPeerConnection[this['userID']];
    }
}

// Init
async function initRoomJoin() {
    const data = location.href.split('data=')[1]; // AES Encryptrd room data

    const privateKey = 'capston2022-SIGN';
    // const encrypted = CryptoJS.AES.encrypt(JSON.stringify(jsonStr), privateKey).toString();
    const dataBytes = CryptoJS.AES.decrypt(data, privateKey);
    const jsonStr = JSON.parse(dataBytes.toString(CryptoJS.enc.Utf8));
    console.log(jsonStr);
    const dataRoomName = jsonStr.room;
    userName = jsonStr.name;
    myName.innerText = userName;
    await intiCall();


    socket.emit("join_room", {
        roomName: dataRoomName,
        userID: userId,
        userName: userName
    }); // [S-1]

    roomName = dataRoomName; // 방의 이름을 변수에 저장
    document.title = '대화방 ' + roomName + ' | SIGN';
}

initRoomJoin();