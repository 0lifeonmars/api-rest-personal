'use strict'

var mongoose = require('mongoose'); // Carga de modulo node mongoose
var Schema = mongoose.Schema; // Carga de esquemas mongoose

var PortfolioSchema = Schema({ // Se crea plantilla para envio a db
    title: String,
    content: String,
    date: { type: Date, default: Date.now }, 
    languages: [String],
    author: Number,
    image: String
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);