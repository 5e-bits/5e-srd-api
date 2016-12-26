var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MonsterSchema   = new Schema({
});

module.exports = mongoose.model('Monster', MonsterSchema, 'monsters');