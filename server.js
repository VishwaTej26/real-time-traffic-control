import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const app = next({ dev: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("traffic:update", (data) => {
      socket.broadcast.emit("traffic:state", data);
    });
  });

  httpServer.listen(3000, () => {
    console.log("Running on http://localhost:3000");
  });
});
