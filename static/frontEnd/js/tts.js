window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
let recoStates = false;

recognition.interimResults = false;
recognition.lang = "ko-KR"; // 언어 설정
recognition.continuous = true; // 계속 인식할 것인지
recognition.maxAlternatives = 1000; // 인식 개선 능력


let speechToText = "";
let interimTranscript = "";
let transcript;
recognition.addEventListener("result", (e) => {
    interimTranscript = "";
    for (let i = e.resultIndex, len = e.results.length; i < len; i++) {
        transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
            speechToText += transcript;
        } else {
            interimTranscript += transcript;
        }
    }
});

// STT 시작
function startReco() {
    if (!recoStates) {
        recognition.start();
        recoStates = true;
        console.log('Reco started');

        // n초마다 서버로 STT 데이터 보내기
        sendData = setInterval(function () {
            if((speechToText + interimTranscript).length > 1) {
                socket.emit("sendTTS", {userText: (speechToText + interimTranscript), userName: userName, userID:userId}, roomName);
                speechToText = "";
                interimTranscript = "";
            }
        }, 1000);
    }
}

// STT 중단
function stopReco() {
    if (recoStates) {
        recognition.stop();
        recoStates = false;
        console.log('Reco stopped');
        clearInterval(sendData);
    }
}