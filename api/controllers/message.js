'use strict'
// librerias
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
// modelo de datos
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function  probando (req, res) {
    res.status(200).send({message:'Holaaaaaaa'});
}
function saveMessage (req, res) {
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'});
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.viewed = false;
    message.created_at = moment().unix();

    message.save((err , messageStored) => {
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!messageStored) return res.status(404).send({message:'Error al enviar mensaje'});

        return res.status(200).send({message: messageStored});
    });
}
function getReceivedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if(req.params.page){ page = req.params.page; }
    var  itemsPerPage = 4;
    Message.find({receiver: userId}).sort('-created_at').populate('emitter', '_id name surname image nick').paginate(page, itemsPerPage, (err, messages, total )=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!messages) return res.status(404).send({message:'No hay mensajes'});
        return res.status(200).send({
            total: total,
            page: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}
function getEmittMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    if(req.params.page){ page = req.params.page; }
    var  itemsPerPage = 4;

    Message.find({emitter: userId}).sort('-created_at').populate('emitter receiver', '_id name surname image nick').paginate(page, itemsPerPage, (err, messages, total )=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!messages) return res.status(404).send({message:'No hay mensajes'});
        return res.status(200).send({
            total: total,
            page: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}
function getMensajesNoVistos(req, res) {
    var userId = req.user.sub;
    Message.count({receiver:userId, viewed:'false'}).exec((err, count) => {
        if(err) return res.status(500).send({message:'Error en la peticion'});
        return res.status(200).send({
            'unviewed': count
        })
    });
}
function setVisto (req, res) {
    var userId = req.user.sub;

    Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {'multi':true}, (err, messageUpdated)=> {
        if(err) return res.status(500).send({message:'Error en la peticion'});
        return res.status(200).send({
            messages: messageUpdated
        });
    });
}
module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmittMessages,
    getMensajesNoVistos,
    setVisto
}