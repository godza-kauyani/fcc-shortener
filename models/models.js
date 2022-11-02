const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
    short_url: String,
    long_url: String,
    edited:{type: Date, default:new Date()}
});

const model = mongoose.model('Url',urlSchema);

exports.default = model;