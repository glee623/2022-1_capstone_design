const socket = io(); // io 와 Browser의 연결 (Scoket.io 실행)
const signin_done_btn = document.getElementById('signin_done');

signin_done_btn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('input');

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            alert(inputs[i].alt + ' 을(를) 입력해 주세요!');
            inputs[i].focus();
            return;
        }
    }

    // if (isNaN(inputs[3].value)) {
    //     alert('생년월일은 오직 숫자 형식만 가능합니다.');
    //     inputs[3].value = '';
    //     inputs[3].focus();
    //     return;
    // }

    socket.emit("SignUp", {
        signId: inputs[0].value,
        signPw: inputs[1].value,
        signName: inputs[2].value,
        signBirth: inputs[3].value
    });
})

socket.on('SignUpRes', (res) => {
    if(res === 'IDExist') {
        alert('이미 존재하는 ID 입니다.');
    } else {
        alert('회원가입이 완료 되었습니다!');
        location.href ='./';
    }
})