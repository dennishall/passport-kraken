'use strict';


var PageModel = require('../models/pages/index');

module.exports = function (router) {

    var model = {page: new PageModel()};

    router.get('/', function (req, res) {
        res.render('index', model);
    });

};
