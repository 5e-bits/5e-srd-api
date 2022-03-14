const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const APIReference = new Schema({
  index: { type: String, index: true },
  name: { type: String, index: true },
  url: { type: String, index: true },
});

module.exports = {
  APIReference,
};
