var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        name: String,
        city: String,
        state: String,
        whereITrade: String,
        countOfTrades: Number,
        tradesWaiting: Number
    }
});

module.exports = mongoose.model('user', userSchema);
