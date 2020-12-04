const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeaponProperty = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: [String],
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('WeaponProperty', WeaponProperty, 'weapon-properties');
