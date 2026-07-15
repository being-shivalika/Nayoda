const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./sockets/socketHandler");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});
initSocket(io);

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`SkillSphere API listening on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
};

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  server.close(() => process.exit(1));
});
