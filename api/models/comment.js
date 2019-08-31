'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = Schema({
    user: String,
    publication: String,
    comment: String,
    created_at: String,
    user: { type: Schema.ObjectId , ref: 'User' },
    publication: { type: Schema.ObjectId, ref: 'Publication'}
});

module.exports = mongoose.model('Comment', commentSchema);