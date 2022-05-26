socket.on("res_onMuteChange", data => {
    const changedDiv = document.querySelector('div[id="' + data['userID'] + '"]')
    const userMicStatus = changedDiv.querySelector('#userMicStatus');

    if(data['muted']) {
        userMicStatus.style.color = '#fb2f2f';
    } else {
        userMicStatus.style.color = '#00ff95';
    }
});