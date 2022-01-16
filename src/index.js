const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)     //socket.io expects raw http server and hence we created server even though express does that behind the scenes

const port = process.env.port || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//socket is an object and contains information of the connected client
//will be called each time a connection is formed with the client
io.on('connection', (socket)=>{           //will not work until we load the client side of the socket.io library
    console.log('New websocket connection')
  
    socket.on('join', (options, callback) => {    //{username, room}
        const {error, user} = addUser({id : socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        //socket.broadcast.emit('message', generateMessage('A new user has joined!'))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        const user = getUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        }
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }  
    })

    socket.on('sendLocation', (position, callback)=>{
        //const locationURL = 
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback('Location shared!')
    })
})

server.listen(port,()=>{
    console.log(`Server up at ${port}`)
})