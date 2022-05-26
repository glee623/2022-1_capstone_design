const chatForm = document.getElementById('chatForm');
const userChat = document.getElementById('userChat');

let lastSender;

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    appendMyChat(userChat.value);
    userChat.value = '';
});

userChat.addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();

        if(userChat.value === '') {
            return;
        }

        document.getElementById('sendChat').click();
    }
});

function appendMyChat(text) {
    socket.emit("user_message", {
        userText: text,
        userName: userName
    }, roomName);

    const myChatBoxDiv = document.createElement('div');
    myChatBoxDiv.setAttribute('class', 'myChatBox')
    if(lastSender != 'ME') {
        myChatBoxDiv.innerHTML = '<span id="myNameOnChat">' + userName + '</span><br>';
    }
    myChatBoxDiv.innerHTML += '<span id="textArea">' + text + '</span>';

    document.getElementById('chatBox').appendChild(myChatBoxDiv);
    myChatBoxDiv.scrollIntoView();
    lastSender = 'ME';
}

function appendReceiveUserChat(data, status = 'normal') {
    const receiveChatBoxDiv = document.createElement('div');
    receiveChatBoxDiv.setAttribute('class', 'receiveChatBox')
    if(lastSender != data['userName']) {
        receiveChatBoxDiv.innerHTML = '<span id="myNameOnChat">' + data['userName'] + '</span><br>';
    }

    if (status == 'tts') {
        receiveChatBoxDiv.innerHTML += '<span id="textArea" class="ttsBG">🗣️' + data['userText'] + '</span>';
    } else {
        receiveChatBoxDiv.innerHTML += '<span id="textArea">' + data['userText'] + '</span>';
    }

    document.getElementById('chatBox').appendChild(receiveChatBoxDiv);
    receiveChatBoxDiv.scrollIntoView();
    lastSender = data['userName'];
}

socket.on("user_message_from", async (data) => {
    appendReceiveUserChat(data);
});

function userStateChange(name, state) {
    const stateDiv = document.createElement('div')
    stateDiv.setAttribute('class', 'statusMessage');

    if (state == 'join') {
        stateDiv.innerText = name + '님이 들어왔습니다.';
    } else if (state == 'left') {
        stateDiv.innerText = name + '님이 나갔습니다.';
    }

    document.getElementById('chatBox').appendChild(stateDiv);
    stateDiv.scrollIntoView();
}

// TTS to Chat
const ttsDiv = document.getElementById('ttsDiv');
var pastData = '';

socket.on("streamTTS", data => {
    if (pastData !== data) {
        if (data['userName'] == userName) { // Show TTS text box for my self
            // appendMyChat('🗣️' + data['userText']);
            appenMyViewChat(data['userText'], 'stt');
        } else { // Show TTS text box from others
            appendUserViewChat(data['userText'], 'stt', data['userID']);
        }
        pastData = data;
    }
});

// Result of SIGN to TEXT
socket.on("streamSIGN", data => {
    if(data['userId'] == userId) {
        appenMyViewChat(data['userText'], 'sign');
    } else {
        appendUserViewChat(data['userText'], 'sign', data['userId']);
    }
});

function appenMyViewChat(text, type) {
    const my_view_inner_chat = document.getElementById('my_view_inner_chat');
    if(type == 'stt') {
        my_view_inner_chat.innerHTML += '<div class="box stt">' + text + '</div>'
    } else {
        my_view_inner_chat.innerHTML += '<div class="box sign">' + text + '</div>'
    }
}

function appendUserViewChat(text, type, userID) {
    const otherUserView = document.querySelector('div[id="' + userID + '"]');
    const otherUserChat = otherUserView.querySelector('.chat_td_inner');
    console.log(otherUserView);
    if(type == 'stt') {
        otherUserChat.innerHTML += '<div class="box stt">' + text + '</div>'
    } else {
        otherUserChat.innerHTML += '<div class="box sign">' + text + '</div>'
    }
}

// Chat bar hide
const rbTopBar = document.getElementsByClassName('rbTopBar')[0];
const rightChatBar = document.getElementById('rightBar');
const open_bar = document.getElementById('open_bar');
const userList = document.querySelector('.userList');

let closeBarStatus = false;

function closeBarToggle() {
    if(!closeBarStatus) {
        rightChatBar.hidden = true;
        rightChatBar.style.display = 'none';
        userList.style.width = '100%';
    } else {
        rightChatBar.style.display = 'flex';
        rightChatBar.hidden = false;
        userList.style.width = '80%';
    }
    open_bar.hidden = !rightChatBar.hidden;
    closeBarStatus = !closeBarStatus;
}