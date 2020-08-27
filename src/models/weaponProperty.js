var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WeaponPropertySchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('WeaponProperty', WeaponPropertySchema, 'weapon-properties');
