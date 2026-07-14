const { Server } = require("socket.io");

let io;

exports.initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Connected", socket.id);

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
    });
};

exports.getIO = () => io;