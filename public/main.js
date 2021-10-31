var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");

const socket = io('http://localhost:3000');
const messageBox = document.getElementById('chatbox')
const convoMessage = document.getElementById('sendmessage')
const convoInput = document.getElementById('inputmessage')

const name = prompt('Enter your username:')
appendMessage("You connected to chatroom")
socket.emit('new-user', name)

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('crocroom', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('crocroom', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


socket.on('chatmessage', data => {
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
    appendMessage(`${name} connected to chatroom`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected from chatroom`)
})

convoMessage.addEventListener('submit', e => {
    e.preventDefault()
    const message = convoInput.value

    appendMessage(`You: ${message}`)
    socket.emit('sendusermessage', message)
    convoInput.value = ''
})

function appendMessage(message)  {
    const elementMes = document.createElement('section')
    elementMes.innerText = message
    messageBox.append(elementMes)
}