const sendFile = document.getElementById('sendFile');
const inputUploadFile = document.getElementById('uploadFile');

sendFile.addEventListener('click', () => {
    inputUploadFile.click();
});

inputUploadFile.addEventListener('change', (e) => {
    const file = inputUploadFile.files[0];
    if (file) {
        const timeString = new Date()
        const fileNameStr = CryptoJS.SHA256(roomName + '_' + userName + '_' + timeString.getTime() + '_' + file.name)
        showFileOnChat(file, 'ME', fileNameStr.toString());

        socket.emit("fileUpload", {
            file: {name:file.name, size:file.size, file:file},
            fileName: file.name,
            userName: userName,
            roomName: roomName,
            timeStr: timeString.getTime(),
            fileNameHash: fileNameStr.toString()
        })
    }
})

function showFileOnChat(file, sender, fileNameStr) {
    const fileMessage = document.createElement('div');
    if (sender === 'ME') {
        fileMessage.setAttribute('class', 'fileMessage');
    } else {
        fileMessage.setAttribute('class', 'fileMessage other');
    }

    fileMessage.innerHTML = '<a id="fileName">' + file.name + '</a><br>';
    fileMessage.innerHTML += '<a id="size"> Size ' + file.size + ' KB </a><br>';
    fileMessage.innerHTML += '<div class="downloadBtn" onclick="clickOnSelvesA(\'./static/files/' + fileNameStr + '_' + file.name + '\')"><i class="bi bi-download"></i></div>';
    
    if(sender === 'ME' && lastSender != 'ME') {
        document.getElementById('chatBox').innerHTML += '<span id="myFileSenderName">' + userName + '</span><br>';
        lastSender = 'ME';
    } else if (sender != lastSender) {
        document.getElementById('chatBox').innerHTML += '<span id="otherFileSenderName">' + sender + '</span><br>';
        lastSender = sender;
    }

    document.getElementById('chatBox').appendChild(fileMessage);
    fileMessage.scrollIntoView();
}

function clickOnSelvesA(downStr) {
    const aTag = document.createElement('a')
    aTag.setAttribute('href',downStr);
    aTag.setAttribute('download','');
    aTag.click();
}

// Receive File
socket.on('userSendFile', data => {
    showFileOnChat(data['file'], data['userName'], data['fileNameHash']);
})