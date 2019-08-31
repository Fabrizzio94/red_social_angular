'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// rutas
api.get('/probando', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmittMessages);
api.get('/unviewed-msg', md_auth.ensureAuth, MessageController.getMensajesNoVistos);
api.get('/set-viewed', md_auth.ensureAuth, MessageController.setVisto);

module.exports = api;