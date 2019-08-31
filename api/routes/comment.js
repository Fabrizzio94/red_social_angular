'use strict'

var express = require('express');
var CommentController = require('../controllers/comments');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// rutas
// api.get('/probando', md_auth.ensureAuth, MessageController.probando);
api.post('/comment', md_auth.ensureAuth, CommentController.saveComment);
/*api.get('/my-messages/:page?', md_auth.ensureAuth, CommentController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, CommentController.getEmittMessages);
api.get('/unviewed-msg', md_auth.ensureAuth, CommentController.getMensajesNoVistos);
api.get('/set-viewed', md_auth.ensureAuth, CommentController.setVisto);*/

module.exports = api;