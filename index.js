'use strict'

// npm install --save-dev nodemon >>>> comando para instalar nodemon solo en desarrollo
// Despues en "package.json" añadir {"start": "nodemon index.js"} en json "Scripts"
// npm start >>>> comando para iniciar nodemon  y ver cambios en simultaneo :)

var mongoose = require('mongoose'); //Carga Modulo Mongoose
var app = require('./app') // Cargamos modulo "app.js"
var port = 3900; // Puerto para al aplicación
mongoose.Promise = global.Promise; // uso de promesas en mongoDB

//Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/portafolio', {useNewUrlParser: true}).then(() => { // Conexión URL y opcion {useNewUrlParser: true} para utilizar nuevas funcionalidades de mongoose 
    console.log('La conexión a la base de datos se ha realizado bien');

    //Crear servidar y escuchar peticiones HTTP
    app.listen(port, () => { // Pasamos port a funcion listen() y funcion de flecha
        console.log('Servidor corriendo en http://localhost:' + port);
    });
});