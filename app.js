const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "pug");
var port = process.env.PORT || 3000;

//Render Index page
app.get("/", (req, res) => {
  res.render("index");
});

//Get userName and roomName from form and pass it to room
app.post("/room", (req, res) => {
  roomName = req.body.roomName;
  userName = req.body.userName;
  res.redirect(`/room?userName=${userName}&roomName=${roomName}`);
});

//Rooms
app.get("/room", (req, res) => {
  res.render("room");
});

//Start Server
const server = app.listen(port, () => {
  console.log(`Server Running on ${port}`);
});

const io = socket(server);
require("./utils/socket")(io);
