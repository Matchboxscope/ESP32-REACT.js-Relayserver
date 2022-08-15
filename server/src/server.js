const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const url = require('url');

require('dotenv').config()
const { WS_PORT, SERVER_EVENTNAME, CLIENT_EVENTNAME } = process.env
const port = WS_PORT;

const listener = (eventName, ...args) => {
  console.log(`Eventname: ${eventName}`);
  //console.log(`Args: ${args}`);
}
// socketIO.sendEVENT(output)
// [IOc] Connected to url: /socket.io/?EIO=4
// ["jpgstream_serverio",{"hostname":"ESP32CAM-142","location":"Livingroom","picture":"⸮⸮⸮⸮"}]

io.on('connection', (socket) => {

  //console.log(`Connected client id ${socket.id}`)
  console.info('[' + socket.id + '] new connection', socket.request.connection.remoteAddress);
  //console.info(socket.request.headers);
  //console.info(socket.request.connection.eventname);


  socket.onAny(listener);

  socket.on(SERVER_EVENTNAME, function (message) {
    //console.log("image received", message)
    io.emit(CLIENT_EVENTNAME, { message, ip: socket.request.connection.remoteAddress })
  });

  socket.on('reconnect', () => {
    //console.log(`ReConnected client id ${socket.id}`)
  })

  socket.on('disconnect', (reason) => {
    console.log(`DisConnected client id ${socket.id} and reeason is: ${reason}`)
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'view/server.html'))
})
app.get('/config.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'view/config.js'))
})

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})



/* import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Server } from "socket.io"

// custom

const { WS_PORT, HTTP_PORT, CLIENT_CORS_URL } = process.env

const app = express()
app.use(cors())
let connectedClients = []

const io = new Server(WS_PORT,
  // {
  //   handlePreflightRequest: (req, res) => {
  //     const headers = {
  //       "Access-Control-Allow-Headers": "Content-Type, Authorization",
  //       "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
  //       "Access-Control-Allow-Credentials": true
  //     };
  //     res.writeHead(200, headers);
  //     res.end();
  //   }
  // }
  {
    cors: {
      origin: '*', //CLIENT_CORS_URL,
      methods: ["GET", "POST"],
      // allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  }
)


io.on('connection', (socket) => {

  const listener = (eventName, ...args) => {
    console.log(eventName, args);
  }

  socket.onAny(listener);

  console.log(`Connecté au client ${socket.id}`)

  socket.on('jpgstream_serverio', function (msg) {
    console.log("image received")
    io.emit('jpgstream_clientio', msg.pic)
  });
})


// preview page
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './server.html'))
})

app.listen(HTTP_PORT, (req, res) => {
  if (process.env.NODE_ENV !== 'production') console.log(`HTTP server is avaliable at port ${HTTP_PORT}`)
}) */