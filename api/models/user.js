'use strict'
// modulos de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var userSchema = Schema({
    name: String,
    surname: String,
    fecha: String,
    email: String,
    password: String,
    role: String,
    image: String,
    estado: Boolean
});
//userSchema.plugin(uniqueValidator, { message: '{PATH} is unico'});
// exportar modelo
module.exports = mongoose.model('User', userSchema);