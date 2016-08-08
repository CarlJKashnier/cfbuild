var mongoose = require('mongoose');
var curioSchema = mongoose.Schema({
title: String,
description: String,
userName: String,
userID: String,
tradeOfferedBy: Array,
tradedToName: String,
tradedToID: String
});

module.exports = mongoose.model('CurioSchema', curioSchema);
