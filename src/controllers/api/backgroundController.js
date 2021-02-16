const Background = require('../../models/background');
const SimpleController = require('../simpleController');

const simpleController = new SimpleController(Background);

exports.index = (req, res, next) => simpleController.index(req, res, next);
exports.show = (req, res, next) => simpleController.show(req, res, next);
