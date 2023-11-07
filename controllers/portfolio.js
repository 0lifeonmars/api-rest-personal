'use strict'
var validator = require('validator'); // Carga de modulo node validator
var fs = require('fs');
var path = require('path');
var Portfolio = require('../models/portfolio'); // Carga modelo portfolio.js


var controller = {
    // Guardar Nuevos Portafolios
    save: (req, res) => {
        // Recoger parametros de usuarios desde el post
        var params = req.body;

        // Validar los datos (Con Validator)
        try {
            var validate_title =  !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_languages = !validator.isEmpty(params.languages);
            var validate_author = !validator.isEmpty(params.author);
        }
        catch(err) {
            return res.status(200).send({ 
                status: 'error',
                message: 'Faltan datos por enviar!!!' 
            });
        }

        
        if( validate_title && validate_content && validate_languages && validate_author) {
            
            // Convertir Lenguajes en string y separarlos para crear array[];
            var lenguages_params =  String(params.languages);
            var lenguajes_split = lenguages_params.split(',');

            // Crear el objeto a guardar
            var portfolio = new Portfolio();
            portfolio.title = params.title;
            portfolio.content = params.content;
            portfolio.languages = lenguajes_split;
            portfolio.author = params.author;
            portfolio.image = null;

            //Guardar Articulo
            portfolio.save().then( () => {
                return res.status(200).send({ status: 'success', portfolio: portfolio });
            }).catch(error => { // Mensaje de Error
                return res.status(404).send({ status: 'error', message: 'El portafolio no se ha guardado.' }); // 
            });

            //Devolver repuesta
            return res.status(200).send({ status: 'success', portfolio });

        } else { return res.status(500).send({ status: 'error', message: 'Datos no válidos' }); }
    },

    // Mostrar todos los portafolios
    getPortfolios: (req, res) => {
        var query = Portfolio.find({});
        var last = req.params.last;
        
        
        if(last || last != undefined){ query.limit(last); }


        // Find > Encontrar datos de base de datos
        query.sort('id').then((portfolios) => { // ordena por id 
            if(!portfolios) { // sino articulos esta vacío
                return res.status(404).send({ message: 'No hay portafolios...' }); // error 
            }
            return res.status(200).send({ portfolios: portfolios }); // muestrame los articulos
        }).catch((err) =>{  // si hay algun error
            return res.status(500).send({ message: 'Error al devolver portafolios...' }); // mensaje de error 
        });
    },

    // Mostrar portafolio por id
    getPortfolio: (req, res) => {
        //recoger id de la url
        var portfolioId = req.params.id;
        
        //comprobar que existe
        if(!portfolioId || portfolioId == null) {
            return res.status(404).send({ status: 'error', message: 'No existe el portafolio !!!' });
        }

        //buscar el articulo
        Portfolio.findById(portfolioId).then((portfolio) => { // encontrar un articulo en base al id
            if(!portfolio) { // sí articulo esta vacío
                return res.status(404).send({ status: 'error', message: 'No se encuentra el portafolio...' }); // respuesta de error 
            }
            return res.status(200).send({ status: 'success: Portafolio Encontrado', portfolio }); // muestrame el articulo
        }).catch((err) =>{  // si hay algun error
            return res.status(500).send({ status: 'error', message: 'Error al buscar portafolio desde el servidor' }); // mensaje de error 
        });
    },

    // Actualizar portafolio por id
    update: (req, res) => {
        // Recoger el id del articulo por la url
        var portfolioId = req.params.id;
 
        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try{
            var validate_title =  !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_languages = !validator.isEmpty(params.languages);
            var validate_author = !validator.isEmpty(params.author);
        }catch(err){
            return res.status(200).send({ status: 'error', message: 'Faltan datos por enviar.' }); 
        }

        if(validate_title && validate_content && validate_languages && validate_author){
            // Convertir Lenguajes en string y separarlos para crear array[];
            var lenguages_params =  String(params.languages);
            var lenguajes_split = lenguages_params.split(',');

            // Crear el objeto a actualizar como json
            var portfolioPut = {
            'title' : params.title,
            'content': params.content,
            'languages' : lenguajes_split,
            'author' : params.author,
            'image' : null };
            
            // Find and update
            Portfolio.findOneAndUpdate({_id: portfolioId}, portfolioPut, {new:true}).then( portfolioUpdated => {
                return res.status(200).send({ status: 'success: Portafolio actualizado', portfolio: portfolioUpdated });
            }).catch( () => {
                return res.status(404).send({ status: 'error', message: `No existe el portafolio con id = ${portfolioId}` });
            });
        } else {
            return res.status(500).send({ status: 'error', message: 'La validación no es correcta.' });
        }
    },

    // Borrar portafolio por id
    delete: (req, res) => {
        //recoger id de la url
        var portfolioId = req.params.id;

        //find and delete
        Portfolio.findOneAndDelete({_id: portfolioId}).then( portfolioRemove => {
            if(portfolioRemove) {
                return res.status(200).send({ status: 'success: Portafolio Borrado', portfolio: portfolioRemove  });
            } else {
                return res.status(404).send({ status: 'error', message: 'El portafolio no existe o no pudo ser borrado' })
            }
        })
        .catch( () => {
            return res.status(500).send({ status: 'error', message: `Error al borrar: No existe el portafolio con id = '${portfolioId}'` });
        }); 
    },

    // Subir Imagen a un portafolio por id 
    upload: (req, res) => {
        // configurar el modulo connect multiparty router/portfolio.js (hecho)
        
        //Recojer el fichero de la peticion
        var file_name = 'Imagen no subida...';
         if(!req.files) { 
            return res.status(404).send({ status: 'error', massage: file_name });
        }

        // Conseguir el nombre y extención
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // !ADVERTENCIA LINUX O MAX* SERIA >> file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del archivo
        var extension_split = file_name.split('.');
        var file_extension = extension_split[1];

        // Comprobar la extension, solo imagenes, sino es valida borrar fichero
        if(file_extension != 'png' && file_extension != 'jpg' && file_extension != 'jpeg' && file_extension != 'gif' && file_extension != 'webp' && file_extension != 'svg') {
            //borrar archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(404).send({ status: 'Error: Formato Imagen', message: 'La extensión de la imagen no es valida'});
            });
        } else {
            // Si todo es valido, sacando id de la url
            var portfolioId = req.params.id;

            // Buscar el portfolio, asignarle el nombre de la imagen, y actualizarlo
            Portfolio.findOneAndUpdate({_id: portfolioId}, {image: file_name}, {new:true}).then( portfolioUpdated => {
                return res.status(200).send({ status: 'Success: Imagen Subida', portfolio: portfolioUpdated });
            }).catch( () => {
                return res.status(500).send({ status: 'error', message: `No existe el portafolio con id = '${portfolioId}'` });
            });
        }

        
    },

    // Conseguir imagen del portafolio
    getImage: (req, res) => {
        var file = req.params.image;
        var path_url = './api-uploads/portfolio/' + file;
        fs.exists(path_url, (exists) => {
            console.log(exists);
            if(exists) {
                return res.sendFile(path.resolve(path_url));

            } else {
                return res.status(404).send({ status: 'error', message: 'La imagen no existe.' });
            }
        });
    },

    // Buscar portafolios
    search: (req, res) => {
        //sacar el string a buscar 
        var searchString = req.params.search;

        //find or
        Portfolio.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i" } },
            { "content": { "$regex": searchString, "$options": "i" } }
        ]})
        .sort([['date', 'descending']]).exec()
        .then( portfolio => { // guardamos articulos encontrados
            if (portfolio && portfolio.length>0) { // si los articulos existen y son mayores a 0 caracteres
                return res.status(200).send({ status: 'success', portfolio }); // respuesta true y mostramos articulos
            } else { // sí no hay articulos
                return res.status(404).send({ status: 'error', message: 'No hay portafolios que coincidan con tu búsqueda.', portfolio}); // respuesta error 404
            }
        })
        .catch( err => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición.',
                    err
                });
            };
        });
    }
};

module.exports = controller; // esto permite usar esto fuera de controller portfolio.js