var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DamageTypeSchema   = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('DamageType', DamageTypeSchema, 'damage-types');