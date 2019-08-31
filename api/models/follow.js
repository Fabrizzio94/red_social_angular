'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var followSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User'},
    followed: { type: Schema.ObjectId, ref: 'User'},
    status: String
});

module.exports = mongoose.model('Follow', followSchema);