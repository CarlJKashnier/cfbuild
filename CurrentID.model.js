var mongoose = require('mongoose');
var currentIDSchema = mongoose.Schema({
currentID: Number,
id: Number
});

module.exports = mongoose.model('CurrentIDSchema', currentIDSchema);
