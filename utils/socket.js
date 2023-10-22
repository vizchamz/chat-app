const { getUsers, users } = require("./getUsers");

//Socket connection
function socket(io) {
  io.on("connection", (socket) => {
    socket.on("joined-user", (data) => {
      //Storing users connected in a room in memory
      var user = {};
      user[socket.id] = data.userName;
      if (users[data.roomName]) {
        users[data.roomName].push(user);
      } else {
        users[data.roomName] = [user];
      }

      //Joining the Socket Room
      socket.join(data.roomName);

      //Emitting New userName to Clients
      io.to(data.roomName).emit("joined-user", { userName: data.userName });

      //Send online users array
      io.to(data.roomName).emit("online-users", getUsers(users[data.roomName]));
    });

    //Emitting messages to Clients
    socket.on("chat", (data) => {
      io.to(data.roomName).emit("chat", {
        userName: data.userName,
        message: data.message,
      });
    });

    //Broadcasting the user who is typing
    socket.on("typing", (data) => {
      socket.broadcast.to(data.roomName).emit("typing", data.userName);
    });

    //Remove user from memory when they disconnect
    socket.on("disconnecting", () => {
      var rooms = Object.keys(socket.rooms);
      var socketId = rooms[0];
      var roomName = rooms[1];
      users[roomName]?.forEach((user, index) => {
        if (user[socketId]) {
          users[roomName].splice(index, 1);
        }
      });

      //Send online users array
      io.to(roomName).emit("online-users", getUsers(users[roomName]));
    });
  });
}

module.exports = socket;
