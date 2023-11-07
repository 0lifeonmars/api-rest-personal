'use strict'

var express = require('express'); // Carga de modulo node express
var PortfolioController = require('../controllers/portfolio'); // Carga de controlador portfolio

var router = express.Router(); // rutas de express

var multiparty = require('connect-multiparty'); // Carga de modulo node multiparty
var md_upload = multiparty({uploadDir: './api-uploads/portfolio'}); // Config directorio de guardado

//RUTAS
router.post('/save', PortfolioController.save);
router.get('/portfolios/:last?', PortfolioController.getPortfolios); // ? = opcional
router.get('/portfolio/:id', PortfolioController.getPortfolio);
router.put('/portfolio/:id', PortfolioController.update);
router.delete('/portfolio/:id', PortfolioController.delete);
router.post('/upload-image-portfolio/:id', md_upload, PortfolioController.upload);
router.get('/get-image-portfolio/:image', PortfolioController.getImage);
router.get('/search-portfolio/:search', PortfolioController.search);

module.exports = router; // esto permite usar esto fuera de route portfolio.js