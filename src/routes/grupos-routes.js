const { Router } = require('express');

const { GruposController } = require('../controllers/grupos-controller');

const routes = Router();

const grupoController = new GruposController();


routes.post('/cadastro', grupoController.cadastro);

routes.get('/cadastro', grupoController.mostraCadastro);

module.exports = routes;