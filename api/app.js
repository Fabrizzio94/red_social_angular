'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var comment_routes = require('./routes/comment');
var message_routes = require('./routes/message');
var nodemail_routes = require('./routes/nodemailer');
// cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
// convierte a json informacion de una peticion
app.use(bodyParser.json());

// cors
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});
// rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', comment_routes);
app.use('/api', nodemail_routes);
/*app.get('/pruebas', (req,res)=> {
    res.status(200).send({
        message: 'Accion de pruebas en el servidor de Node Js'
    });
});*/
// exportar
module.exports = app;