'use strict'

var express = require('express');
var NodeMailController = require('../controllers/nodemailer');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// rutas
api.post('/mail', NodeMailController.SendMail);
api.put('/mailUpdate/:email/:estado', NodeMailController.Confirm);

module.exports = api;