const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProficiencySchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  index: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Proficiency', ProficiencySchema, 'proficiencies');
