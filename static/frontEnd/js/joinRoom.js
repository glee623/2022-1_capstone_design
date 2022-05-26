const joinRoomBtn = document.getElementById('joinRoomBtn');
const joinRoomName = document.getElementById('joinRoomName');
const joinUserName = document.getElementById('joinUserName');
const inputUserName = document.getElementsByClassName('userNameDiv')[0];
const closeBtnForName = document.getElementById('closeBtnForName');
const submitUserName = document.getElementById('submitUserName');
const privateKey = 'capston2022-SIGN';

joinRoomBtn.addEventListener('click', function () {
    if (joinRoomName.value == '') {
        alert('방 이름을 입력해 주세요');
        joinRoomName.focus();
    } else {
        var data;
        if (sessionStorage.getItem('userLogined')) {
            data = {
                'name': sessionStorage.getItem('LoginedName'),
                'room': joinRoomName.value
            }
        } else {
            // const promptUserName = prompt('사용자 이름을 입력해 주세요');
            inputUserName.hidden = false;
            return;
        }

        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), privateKey).toString();
        location.href = '/room?data=' + encrypted;
    }
});

closeBtnForName.addEventListener('click', () => {
    inputUserName.hidden = true;
    inputUserName.value = '';
    alert('비회원은 사용자 이름을 입력하셔야 이용이 가능합니다.');
})

submitUserName.addEventListener('click', () => {
    const inputUserName = document.getElementById('inputUserName');
    
    if(inputUserName.value) {
        data = {
            'name': inputUserName.value,
            'room': joinRoomName.value
        }
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), privateKey).toString();
        location.href = '/room?data=' + encrypted;
    } else {
        alert('사용자 이름을 입력해 주세요');
        inputUserName.focus();
    }
});

const startNow = document.getElementById('startNow');

startNow.onclick = function () {
    joinRoomName.focus();
}