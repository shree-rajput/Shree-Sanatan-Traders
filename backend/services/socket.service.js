import { Server } from "socket.io";

let io;

export const initializeSocket = (server)=>{

    io=new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    });

    io.on("connection",(socket)=>{

        console.log("Connected",socket.id);

        socket.on("disconnect",()=>{
            console.log("Disconnected");
        });

    });

}

export const getIO=()=>io;