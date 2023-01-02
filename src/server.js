import app, { PORT } from "./app.js";
import { Server } from "socket.io";

const server = app.listen(PORT, () => {
  console.log("/***********************************************************");
  console.log(` * Server up and listening on port ${PORT} 🤖`);
  console.log(" **********************************************************/");
});

server.on("error", (err) => {
  console.error(err);
});

const socketServer = new Server(server);

const messageList = [];

socketServer.on("connection", (socket) => {
  socket.emit("welcome", { messages: messageList });

  socket.on("message", (data) => {
    const sender = data.sender;
    const message = data.message;
    const time = data.time;
    const record = {
      sender,
      message,
      time,
    };

    messageList.push(record);
    socket.emit("echo", { sender, messages: messageList });
    socket.broadcast.emit("echo", {
      sender,
      messages: messageList,
    });
  });

  socket.on("login", (newUser) => {
    const newUserName = newUser.userName;

    socket.emit("setUser", { userName: newUserName });
    socket.broadcast.emit("newUser", { userName: newUserName });
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected. Reason: ${reason}`);
  });
});
