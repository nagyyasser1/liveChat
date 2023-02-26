const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const path = require('path')
const { Server } = require('socket.io')

app.use(cors())

app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'), (err) => {
    res.status(500).send(err)
  })
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '/',
  },
})

io.on('connection', (socket) => {
  console.log('User connected ' + socket.id)
  socket.on('join_room', (data) => {
    socket.join(data)
    console.log(`user with id : ${socket.id} joined a room with id : ${data}`)
  })
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data)
  })
  socket.on('disconnect', () => {
    console.log('User disconnected ', socket.id)
  })
})

server.listen(3000, () => {
  console.log('server runing... ')
})
