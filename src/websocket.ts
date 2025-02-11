// import express from "express";
// import http from "http";
// import { server as WebSocketServer } from "websocket";

// const app = express();
// const PORT = 5000;
// const httpServer = http.createServer(app);

// httpServer.listen(PORT, () => {
//   if (process.env.NODE_ENV !== "test") {
//     console.log(`HTTP Server is running on port ${PORT}`);
//   }
// });

// const wsServer = new WebSocketServer({
//   httpServer: httpServer,
//   autoAcceptConnections: false,
// });

// wsServer.on("request", (request) => {
//   const connection = request.accept(null, request.origin);
//   if (process.env.NODE_ENV !== "test") {
//     console.log("Client connected qua WebSocket");
//     connection.sendUTF(
//       JSON.stringify({ message: "Connected to WebSocket server" })
//     );
//   }
// });

// export { app, httpServer, wsServer };

// src/websocket.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`HTTP Server is running on port ${PORT}`);
  }
});


const io = new Server(httpServer, {
  cors: {
    origin: "*", // Cho phép tất cả các origin; bạn có thể điều chỉnh theo nhu cầu bảo mật
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Client connected via Socket.IO");

    socket.emit("message", { message: "Connected to Socket.IO server" });
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected from Socket.IO");
  });
});

export { app, httpServer, io };
