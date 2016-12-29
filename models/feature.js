var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FeatureSchema   = new Schema({
    name: String,
    class: String,
    subclass: String,
    desc: [String],
    choice: {
        choose: Number,
        from: [String]
    },
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