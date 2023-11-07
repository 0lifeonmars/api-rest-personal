'use strict'

// Cargar Modulos de node para crear servidor
var express = require('express'); // Cargar module node express
var bodyParser = require('body-parser'); // Cargar module node body-parse convertir todo a JS nativo usable

// Ejecutar express (HTTP)
var app = express();

// Cargar ficheros rutas
var portfolio_routes = require('./routes/portfolio');

// Middlewares
app.use(bodyParser.urlencoded({extended: false})); // Cargar bodyparser
app.use(bodyParser.json()); // Convertir cualquier peticion a un objeto JSON


//Añadir Prefijos a rutas / Cargar rutas
app.use('/api', portfolio_routes);

// CORS (Para permitir peticiones de front-end)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Exportar modulo (ficherto actual > app.js)
module.exports = app; // esto permite usar esto fuera de app.js