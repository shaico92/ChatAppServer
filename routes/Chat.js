var express = require("express");
var router = express.Router();
const users = [];
const PORT = 4000;
var User = require("../models/Users");
const io = require("socket.io")(PORT);
const ffmpeg = require('ffmpeg')



let chatRooms = [
  { roomId: 1, roomName: "room_1", roomAdmin: "admin1", password: "12343" },
  { roomId: 2, roomName: "room_2", roomAdmin: "admin2", password: "123445" },
  { roomId: 3, roomName: "room_3", roomAdmin: "admin3", password: "1234" },
];

const giveUserColor= ()=>{
  let color = null
  color =Math.floor(Math.random() * 16777215).toString(16);
  if (color!='#FFFFFF') {
    return color;  
  }
  return Math.floor(Math.random() * 16777215).toString(16);;
}

const checkRoomPassword = (roomID, password) => {
  let auth = false;
  chatRooms.forEach((room) => {
    if (room.roomId === roomID) {
      if (room.password === password) {
        auth = true;
      }
    }
  });
  return auth;
};

const getInfo = (roomID) => {
  let roomA = null;
  chatRooms.forEach((room) => {
    if (room.roomId === roomID) {
      roomA = room;
    }
  });
  return roomA;
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

router.post("/createRoom", async (req, res) => {
  const roomProperties = req.body;

  await chatRooms.push(roomProperties);
  res.send(chatRooms);
});

router.get("/", async (req, res) => {
  await res.send(chatRooms);
});

router.get("/:id", async (req, res) => {
  const param = req.params.id;
  const roomInfo = getInfo(parseInt(param));
});

router.post("/:id", async (req, res) => {
  const roomProp = await req.body;
  const result = checkRoomPassword(roomProp.room, roomProp.password);

  res.send(result);
});

io.sockets.on("connection", (client) => {
  
  client.on("new-user", (data) => {
    client.join(data.room);


    const color = giveUserColor();
    // users.push({
    //   clientId: client.id,
    //   name: data.name,
    //   color: color,
    //   room: data.room,
    // });
    
    client.room=data.room;
    client.name=data.name;
    client.color=color
    
    
    const content = { room: client.room, name: client.name };
    client.to(client.room).broadcast.emit("user-connected", content);
  });
  client.on('typing-message',(photo)=>{
    users.forEach((e) => {
      if (e.clientId === client.id) {
        const obj = {who:photo}
        client.to(e.room).broadcast.emit("other-typing",obj)
      }
    
    
  })})

client.on('send-audio',(audioMessage)=>{
  let name = null;
  let color = null;
  let room = null;
  users.forEach((e) => {
    if (e.clientId === client.Id) {
      name = e.name;
      color = e.color;
      room = e.room;
    }
  });


  
})


  client.on("send-chat-message", (message) => {
    
    
    if (message.content.includes("blob:http://localhost:3000")) {

      const file = new File([message.content], filename, {type: contentType, lastModified: Date.now()});



      // client.staticFolder= new ffmpeg(`./public/recordings/${client.room}`)
      // try {
      //   const process = message.content
      // process.then((audio)=>{
      //   audio.fnExtractSoundToMP3(`${client.staticFolder}/file.mp3`,(err,file)=>{
      //     if (!err) {
      //       console.log(`Audio file: ${file}`);
      //     }else{
      //       console.log(`errror : ${err}`);
      //     }
      //   })
      // })
      // } catch (error) {
      //   console.log(e.code);
      //   console.log(e.msg);
      // }
      const voiceBlob=message.content;
      
      console.log(voiceBlob);
      const messageOut = {
        voice: voiceBlob,
        name: client.name,
        color: client.color,
        image: message.image
      }
        client.to(client.room).broadcast.emit("chat-message",messageOut);
    

    }else{
      client.to(client.room).broadcast.emit("chat-message", {
        message: message.content,
        name: client.name,
        color: client.color,
        image: message.image,
      });
    }
    
  
  
  
  });
    
    // }

    
  
  client.on('disconnect-user',whoAndWhere=>{
    
    client.to(client.room).broadcast.emit("user-disconnected", whoAndWhere.user);
    client.room=null;
    client.name=null;
    client.color=null
  })
}
);


module.exports = router;
