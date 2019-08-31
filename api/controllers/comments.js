'use strict'
//var path  = require('path');
//var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Publication = require('../models/publication');
var Comment = require('../models/comment');
// var mongoose = require('mongoose');
function saveComment(req, res) {
    var params = req.body;
    console.log(params);
    var comment = new Comment();
    comment.user = req.user.sub;
    comment.comment = params.comment;
    comment.publication = params.publication;
    comment.created_at = moment().unix();
    // follow.status = 'pending';
    comment.save((err, commentStored)=> {
        console.log(commentStored);
        if(err) return res.status(500).send({message:'Error al guardar el comentario'});

        if(!commentStored) return res.status(404).send({message: 'No se ha guardado el seguimiento'});

        return res.status(200).send({comment: commentStored});
    });
}
module.exports = {
    saveComment
}