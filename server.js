require('dotenv').config();
const express = require("express");
const https = require("https");
const path = require('path')
const http = require("http");
const app = express();
const fs = require('fs');
app.use(express.static(__dirname))

const cors = require('cors')



const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');

let server;

const socket = require("socket.io");

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
  } else {
    app.use(express.static(__dirname));
  }

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    server = http.createServer(app);
  } else {
    const key = fs.readFileSync('cert.key');
    const cert = fs.readFileSync('cert.crt');
    server = https.createServer({key, cert}, app);
  }
  



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
  



const io = socket(server, {
    cors: {
        origin: [
            //  "https://localhost",
            "https://10.136.84.119",
            // "*"
        ],
        methods:["GET", "POST"]
    }
});

const users = {};


app.post("/get-rooms", async(req, res)=>{
    console.log("hey");
    res.send(users);
})


const socketToRoom = {};
const socketToEmail = {};

io.on('connection', socket => {
    console.log("user joined");
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
            console.log("user joining in live room");
            console.log("currnt user: ", socket.id);
            
            console.log("users, ", users);
            
        } else {
            console.log("user created room");
            users[roomID] = [socket.id];
            console.log("users, ", users);

        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);

        
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    }); 

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });


    socket.on("send message", ({ roomID, message, from }) => {
        console.log("67)roomiID: ", roomID, " message: ", message);
        console.log("68)from sockteid: ", socket.id);
        // const from = socket.id;
        console.log("70)users, ", users);
        console.log("users[roomID]: ", users[roomID]);
        
        users[roomID].forEach(async userSocketId => {
            if(userSocketId!=socket.id){

                // const fromInEmail = socketToEmail[from];
                // console.log("from in mail: ", fromInEmail);
                
                // const fromInName = await getUsernameByEmail(fromInEmail)
                // console.log("from: ", from , " in name: ", fromInName);
                
                io.to(userSocketId).emit('receive message', {from: from||"Unknown", message});
                
            }
        });
    });


    function removeSocketIdFromRoom(){
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        console.log("emitting all userd to say good bye to ", socket.id);
        console.log("usersinthis rrooom: ", users[roomID], "\n");
        
        if(users[roomID]){
            users[roomID].forEach(userSocketId => {
                io.to(userSocketId).emit('remove user', socket.id);
            });
        }
    }

    socket.on('leave room', ()=>{
        console.log(`${socket.id} wants to leave\n`);
        
        removeSocketIdFromRoom();
    })

    socket.on('tell everyone that i arrived', async({name, roomID}) => {
        console.log("email209: ", name);
        socketToEmail[socket.id] = name;
        console.log('ste: ', socketToEmail);
        
        if(users[roomID]){
            const user = name;
            users[roomID].forEach(userSocketId => {
                console.log(name, "slsl");
                io.to(userSocketId).emit('user broadcasting his name', name||"unknown");
            });
        }
    })


    socket.on('disconnect', () => {
        removeSocketIdFromRoom();
        console.log(`${socket.id} removed from ${socketToRoom[socket.id]}\n`);
        console.log("user in 99 server: ", users);
    });

});
const PORT = process.env.PORT || 8181;
server.listen(PORT, "0.0.0.0", () => console.log(`server is running on port ${PORT}`));