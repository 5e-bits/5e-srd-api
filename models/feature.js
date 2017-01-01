var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FeatureSchema   = new Schema({
    name: String,
    class: {
        name: String,
        url: String
    },
    subclass: {
        name: String,
        url: String
    },
    level: Number,
    desc: [String],
    url: String
});

FeatureSchema.pre('save', function (next) {
    consoel.log("Inside Pre")
  if (0 === this.choice.from.length) {
    this.choice = undefined;                                                                                                                                   
  }
  next();
})

module.exports = mongoose.model('Feature', FeatureSchema, 'features');