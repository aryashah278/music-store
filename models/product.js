var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    isDeleted: {type: Boolean, required: true}
});

module.exports = mongoose.model('Product',schema);