/**
 * A model for our user
 */
'use strict';
var nodemailer = require('nodemailer');
var emailVerificationTokenModel = require('../models/emailVerificationToken');

var emailCredentials = {
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP", emailCredentials);

// todo - figure out how to use the app.render() method instead of the nodemailer templating

var Email = {
    sendVerificationEmail: function(user, req, next){
        new emailVerificationTokenModel().createToken(user._id, function (err, token) {
            if (err) return console.log("Couldn't create verification token", err);
            transporter.templateSender({
                subject: 'Please verify your email for {{sitename}}',
                from: emailCredentials.auth.user,
                to: user.email,
                html: '<h1>{{user.firstName}}</h1><p>Please <a href="{{url}}">verify your email address</a>.</p>'
            }, {
                user: user,
                url: req.protocol + "://" + req.get('host') + "/verify/" + token,
                sitename: 'kraken passport example'
            }, function(err){
                console.log('sent email', err);
                next();
            });
        });
    }
};

module.exports = Email;