const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const APIReference = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

module.exports = {
  APIReference,
};
