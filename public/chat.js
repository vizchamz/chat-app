const output = document.getElementById("output");
const message = document.getElementById("message");
const send = document.getElementById("send");
const feedback = document.getElementById("feedback");
const roomMessage = document.querySelector(".room-message");
const users = document.querySelector(".users");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  roomMessage.innerHTML += "<p>Connected to the server</p>";
});

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get("userName");
const roomName = urlParams.get("roomName");
console.log(userName, roomName);

//Display the roomName the user is connected to
roomMessage.innerHTML += `Connected in room ${roomName}`;

//Emitting userName and roomName of newly joined user to server
socket.emit("joined-user", {
  userName: userName,
  roomName: roomName,
});

//Sending data when user clicks send
send.addEventListener("click", () => {
  socket.emit("chat", {
    userName: userName,
    message: message.value,
    roomName: roomName,
  });
  message.value = "";
});

//Sending userName if the user is typing
message.addEventListener("keypress", () => {
  socket.emit("typing", { userName: userName, roomName: roomName });
});

//Displaying if new user has joined the room
socket.on("joined-user", (data) => {
  output.innerHTML +=
    "<p>--> <strong><em>" +
    data.userName +
    " </strong>has Joined the Room</em></p>";
});

//Displaying the message sent from user
socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.userName + "</strong>: " + data.message + "</p>";
  feedback.innerHTML = "";
  document.querySelector(".chat-message").scrollTop =
    document.querySelector(".chat-message").scrollHeight;
});

//Displaying if a user is typing
socket.on("typing", (user) => {
  feedback.innerHTML = "<p><em>" + user + " is typing...</em></p>";
});

//Displaying online users
socket.on("online-users", (data) => {
  users.innerHTML = "";
  data.forEach((user) => {
    users.innerHTML += `<p>${user}</p>`;
  });
});
