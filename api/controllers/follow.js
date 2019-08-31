'use strict'
//var path  = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
// var mongoose = require('mongoose');
function saveFollow(req, res) {
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;
    // follow.status = 'pending';
    follow.save((err, followStored)=> {
        if(err) return res.status(500).send({message:'Error al guardar el seguimiento'});

        if(!followStored) return res.status(404).send({message: 'No se ha guardado el seguimiento'});

        return res.status(200).send({follow: followStored});
    });
}
// borrar seguidor
function deleteFollow(req, res) {
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user':userId, 'followed':followId}).remove(err => {
        if(err) return res.status(500).send({message:'error al dejar de seguir'});
        return res.status(200).send({message:'El follow se ha eliminado'});
    })
}
// listar seguidores de usuario
function getFollowingUser(req, res){
    var userId = req.user.sub;
    
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    var itemsPerPage = 4;
    Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total)=>{
        if(err) return res.status(500).send({message:'error en el servidor'});
        if(!follows) return res.status(404).send({message:'No estas siguiendo a ningun usuario'});
        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}
function getFollowedUsers(req, res) {
    var userId = req.user.sub;
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }
    var itemsPerPage = 4;
    Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total)=>{
        if(err) return res.status(500).send({message:'error en el servidor'});
        if(!follows) return res.status(404).send({message:'No tienes seguidores'});
        followUserIds(req.user.sub).then((value) => {
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}
// lista no paginada ( usuario que sigo)
function getMyFollows(req, res) {
    var userId = req.user.sub;
    var find = Follow.find({user: userId});
    if(req.params.followed){
        find = Follow.find({followed: userId});
    }
    find.populate('user followed').exec((err, follows) => {
        if(err) return res.status(500).send({message:'error en el servidor'});
        if(!follows) return res.status(404).send({message:'No sigues a ningun usuario'});
        return res.status(200).send({ follows });
    });
}
/*function getStatusFollow(req, res) {
    var userId = req.user.sub;
    // var userId = req.body;
    var finda =  req.params['followed'];
    // var valor = [];
    // var ll = req.params.path('followed');
    console.log(req.params['followed']);
    console.log(finda);
    Follow.find({user: userId, followed: finda} ,(err, result) => {
        // console.log(err);
        if(err) return res.status(500).send({message:'error en el servidor'});
        if(!result) return res.status(404).send({message:'Usuario no encontrado'});
        // console.log('resultado ' + valor);
        return res.status(200).send({
            // result,
            result,
            /*followed: result.followed,
            status: result.status 
        });
    });
}*/
async function followUserIds (user_id) {
    var following = await Follow.find({"user": user_id}).select({'_id': 0, '__uv': 0, 'user': 0}).exec().then((follows)=>{
        var follows_clean=[];
        follows.forEach((follow)=>{
            follows_clean.push(follow.followed);
        });
        return follows_clean;
    }).catch((err)=>{
        return handleerror(err);
    });

    var followed = await Follow.find({"followed": user_id}).select({'_id': 0, '__uv': 0, 'followed': 0}).exec().then((follows)=>{        
        var follows_clean=[];
        follows.forEach((follow)=>{
        follows_clean.push(follow.user);
        });
        return follows_clean;
    }).catch((err)=>{
        return handleerror(err);
    });
    //console.log(following);
    return {
        following: following,
        followed: followed
    }
}
module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUser,
    getFollowedUsers,
    getMyFollows,
    // getStatusFollow
}