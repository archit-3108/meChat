const socket = io('http://localhost:8000');

// Get DOM elements in respective JS variable.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that is played while message is received.
var audioR = new Audio('./asset/ting.mp3');
// var audioS = new Audio('./asset/sent');


// Function which will append event info to the container.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audioR.play();
    }
    // else if(position == 'right'){
    //     audioS.play();
    // }
}


// Ask new user for name & let the server know...
const name = prompt("Enter your name to join: ");

socket.emit('new-user-joined', name);

// If new user joins, receive the user name from the server.
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
})


// If server sends a message, receive it.
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})


// If a user leaves, let the server know ans append info to container.
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
})


// If the form get submitted, send server the message.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})