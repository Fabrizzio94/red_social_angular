'use strict'

var mongoose = require('mongoose');
var app = require('./app');
const port = process.env.PORT || 3800;
// socket io
const http = require('http');
const server = http.Server(app);
const socketIO = require('socket.io');
const io = socketIO(server);
// conexion web sockets
io.on('connection', (socket) => {
    console.log('user connected: ' + socket.id);
    // socket.on('new-message', (message) => {
    //     console.log(message);
    //     io.emit('new-message', message);
    //     console.log( 'el mensaje emitido: '+message);
    // });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
// promesas - conexion a mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red_social', { useNewUrlParser: true })
        .then(()=>{
            console.log('La conexion a la base de datos "red_social" se realizo con exito');
            // Crear servidor
            server.listen(port,  () => {
                console.log(`Servidor corriendo en localhost: ${port} `);
            });
        })
        .catch(err => console.log(err));