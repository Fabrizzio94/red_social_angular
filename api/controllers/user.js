'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var mongoosePaginate = require('mongoose-pagination');
// 
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');
function home(req, res){
    res.status(200).send({
        message: 'Hola mundo desde servidor node js'
    });
}

function pruebas (req,res) {
    res.status(200).send({
        message: 'Accion de pruebas en el servidor de Node Js'
    });
}
// registro
function saveUser(req, res) {
    var params = req.body;
    var user = new User();
    if(params.name && params.surname && 
        params.fecha && params.email && params.password){
            user.name = params.name;
            user.surname = params.surname;
            user.fecha = params.fecha;
            user.email = params.email;
            user.role = 'ROLE USER';
            user.image = null;
            user.estado = false;
            // Controllar usuarios duplicados
            // condicion dentro de mongo con la condicion y operador OR
            User.find({$or: [
                                {email: user.email}
                            ]}).exec((err, users) => {
                                if(err) return res.status(500).send({message:'Error en la peticion de usuario'});
                                if(users && users.length >= 1) {
                                    return res.status(200).send({message:'El usuario que intenta registrar, ya existe!'});
                                }else{
                                    // Encriptar password y guardado de usuario en db
                                    bcrypt.hash(params.password, null, null, (err, hash) => {
                                        user.password = hash;
                                        user.save((err, userStored) => {
                                            //  console.log(err);
                                            if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                                            if(userStored){
                                                res.status(200).send({user: userStored});
                                            }else{
                                                res.status(404).send({message: 'No se ha registrado el usuario'});
                                            }
                                        });
                                    });
                                }
                            });            
    }else {
        res.status(200).send({ message: 'Envia todos los campos necesarios'});
    }
}
// login
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: 'ERROR en la peticion'});
        if(user){
            bcrypt.compare(password, user.password, (err, check ) => {
                if(check) {
                    // devolver datos de usuario
                    if(params.gettoken){
                        // generar y devolver token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                    
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
                }
            });
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido logear'});
        }
    });
}
// Conseguir datos de un usuario
/*function getUser (req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message:'error en la peticion'});

        if(!user) return res.status(404).send({message: 'El usuario no existe'});
        Follow.findOne({'user': req.user.sub,"followed": userId}).exec((err, follow)=>{
            if(err) return res.status(500).send({message:'Error al comprobar el seguimiento'});
            return res.status(200).send({user, follow});
        })
        //return res.status(200).send({user});
    });
}*/
/* PRUEBA CON ASYC Y AWAIT PARA GETUSER*/
function getUser (req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message:'error en la peticion'});

        if(!user) return res.status(404).send({message: 'El usuario no existe'});
        
        followThisUser(req.user.sub ,userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user, 
                following: value.following, 
                followed: value.followed });
        });
    });
}
//
async function followThisUser(identity_user_id, user_id){
    try {
        var following = await Follow.findOne({ user: identity_user_id, followed: user_id}).exec()
            .then((following) => {
                //console.log(following);
                return following;
            })
            .catch((err)=>{
                return handleerror(err);
            });
        var followed = await Follow.findOne({ user: user_id, followed: identity_user_id}).exec()
            .then((followed) => {
                //console.log(followed);
                return followed;
            })
            .catch((err)=>{
                return handleerror(err);
            });
        return {
            following: following,
            followed: followed
        }
    } catch(e){
        console.log(e);
    }
}
//*/
// devolver listado de usuarios paginados
function getUsers (req, res) {
    var identity_user_id = req.user.sub;
    var page = 1;
    var itemsPerPage = 5;
    //console.log(identity_user_id);
    //console.log(req.params.page);
    if(req.params.page) {
        page = req.params.page;
    }
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(!users) return res.status(404).send({message:'No hay usuario disponibles'});
        // console.log('aqui ' + users);
        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        });
        
    });
}
//
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
//
function getCounters(req, res) {
    var userId = req.user.sub;
    if(req.params.id){
        userId = req.params.id;
    }
    getCountFollow(userId).then((value) => {
    return res.status(200).send(value);
    });
}
async function getCountFollow(user_id) {
    var following = await Follow.count({'user':user_id}).exec().then((count) => {
        return count;
    }).catch((err)=> {
        return handleerror(err);
    });
    var followed = await Follow.count({'followed': user_id}).exec().then((count) => {
        return count;
    }).catch((err)=> {
        return handleerror(err);
    });
    var publications = await Publication.count({'user': user_id}).exec().then((count)=> {
        return count;
    }).catch((err)=> {
        return handleerror(err);
    });
    return {
        following: following,
        followed: followed,
        publications: publications
    }
}
// actualizar usuarios
function updateUser (req, res) {
    var userId = req.params.id;
    var update = req.body;
    // borrar propiedad password
    delete update.password;
    if(userId != req.user.sub) {
        return res.status(500).send({message:'no tienes permiso para actualizar los datos del usuario'});
    }
    User.find({ $or: [
        {email: update.email}
    ]}).exec((err, users) => {
        // console.log(users);
        var flag_email = false;
        
        users.forEach((user) => {
            if (user && user._id != userId) flag_email = true;
        });
        if (flag_email) return res.status(404).send({message:'Email ya en uso'});
        
        User.findByIdAndUpdate(userId, update, {new:true},(err, userUpdated) => {
            if(err) return res.status(500).send({message:'Error en la peticion'});
    
            if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
    
            return res.status(200).send({user: userUpdated});
        });
    });
}
// actualizar websocket
function updateUserIdSocket (req, res) {
    var userId = req.params.id;
    var update = req.body.web_id;
    console.log(req.body);
    // borrar propiedad password
    // delete update.password;
    if(userId != req.user.sub) {
        return res.status(500).send({message:'no tienes permiso para actualizar los datos del usuario'});
    }
    User.findOneAndUpdate({age: 17}, {$set:{name:"Naomi"}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });
    // User.find({ $or: [
    //     {web_id: update.web_id}
    // ]}).exec((err, users) => {
    //     // console.log(users);
    //     // var flag_email = false;
        
    //     // users.forEach((user) => {
    //     //     if (user && user._id != userId) flag_email = true;
    //     // });
    //     // if (flag_email) return res.status(404).send({message:'Email ya en uso'});
        
    User.findByIdAndUpdate(userId, { $set: { web_id: update }}, {new:true},(err, userUpdated) => {
        if(err) return res.status(500).send({message:'Error en la peticion'});

        if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

        return res.status(200).send({user: userUpdated});
    });
    //  });
}
// avatar de usuario: subida de imagen/avatar
function uploadImage(req, res) {
    var userId = req.params.id;
    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        // nombre de archivo
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        // extension del archivo
        var file_ext = ext_split[1];
        if(userId != req.user.sub) {
            return removeFileOfUploads(res, file_path, 'no tienes permiso para actualizar los datos del usuario' ); 
        }
        // 
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            // actualizar documento de usuario logeado
            User.findOneAndUpdate({_id: userId}, {image: file_name}, {new:true}, (err, userUpdated)=> {
                if(err) return res.status(500).send({message:'Error en la peticion'});

                if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdated});
            });
        }else{
            return removeFileOfUploads(res, file_path, 'Extension no valida');            
        }
    }else{
        return res.status(200).send({message:'No se ha podido cargar el archivo'});
    }
}
// remover archivos cargados
function removeFileOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
    });
}

// listado de imagen
function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists) => {
        if(exists) {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message: 'no existe la imagen'});
        }
    })
 }
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile,
    updateUserIdSocket
}