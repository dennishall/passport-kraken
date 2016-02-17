'use strict';

var User = require('../../models/user'),
    PageModel = require('../../models/pages/register');


module.exports = function (router) {

    var model = {page: new PageModel()};


    /**
     * Display the login page. We also want to display any error messages that result from a failed login attempt.
     */
    router.get('/', function (req, res) {

        //Include any error messages that come from the login process.
        model.messages = req.flash('error');
        res.render('register', model);
    });

    /**
     * Receive the login credentials and authenticate.
     * Successful authentications will go to /profile or if the user was trying to access a secured resource, the URL
     * that was originally requested.
     *
     * Failed authentications will go back to the login page with a helpful error message to be displayed.
     */
    router.post('/', function (req, res) {

        // todo - check if email is taken...
        // todo - create a new route just for that, so it can be used via ajax to enhance the register form.

        // thwart attempts to bypass email verification
        req.body.isEmailVerified = false;

        var newUserCandidate = new User(req.body);

        //Retrieve the user from the database by login
        User.findOne({email: newUserCandidate.email}, function(err, user) {
            if(err){
                console.log('error registering user with email', req.body.email, 'error:\n', err);
                res.end(err);
            } else {
                if(user) {
                    // user with that email address already exists.
                    delete user.password;
                    res.render('register', {user: user, messages: ['Email already in use']});
                } else {
                    newUserCandidate.save();
                    newUserCandidate.sendVerificationEmail(req, function(err){
                        if(err){
                            res.end(err);
                        } else {
                            res.render('register-success', {user: newUserCandidate});
                        }
                    });
                }
            }
        });

    });


};
