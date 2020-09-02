


const msgInput = document.getElementById('messageInput');
const messageForm = document.getElementById('send-container');
const msgContainer = document.getElementById('outPutContainer');
const appendMsg = ( msg)=>{
    const msgOutput = document.createElement('div');
    msgOutput.innerText=  msg;
    msgContainer.append(msgOutput);
}
const socket = io('http://localhost:3000')
const name = prompt('Please enter your name');
appendMsg('You Joined!');
socket.emit('new-user',name);





socket.on('user-connected', name=>{
    appendMsg(`${name} connected`);
    
})
socket.on('chat-message', data=>{
    appendMsg(`${data.name}: ${data.message}`)
});

messageForm.addEventListener('submit', e=>{
    e.preventDefault()
    const message = msgInput.value;
    socket.emit('send-chat-message',message);
    msgInput.value= '';
})



