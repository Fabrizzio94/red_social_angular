'use strict'
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var path = require('path');
var User = require('../models/user');

function Confirm (req, res) {
    console.log(req.params);
    var params = req.params;
    var userId = params.email;
    console.log(userId + ' ' + params.estado);
    var user = new User();
    // var update = user.estado = req.body.estado;
    /// var query = { email = 'fer@fer.com'};
    /* User.findByIdAndUpdate( email: params.email , {estado: params.estado}, {new:true},(err, userUpdated) => {
        console.log(err);
        if(err) return res.status(500).send({message:'Error en la peticion'});

        if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

        return res.status(200).send({user: userUpdated});
    });*/
}

function SendMail (req, res) {
    console.log(req.body);
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'nonreplynodemail@gmail.com',
              pass: '@admin123'
          }
    });
    let mailOptions = {
        from: '"Node Mail" <nonreplynodemail@gmail.com>', // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.body, // plain text body
        html: `<b>NodeJS Email</b>
        <form method="POST"> 
        <a href="https://0.0.0.0:3800/api/mailUpdate">
            <input type="submit" value="Click para confirmar correo">
        </a>
        
        <button>
            <a href="https://www.google.com">Dale click para confirmar</a>
        </button>
        </form>
        
        ` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            // res.render('index');
    });
    
}

module.exports = {
    SendMail,
    Confirm
}