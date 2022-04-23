const { Router } = require('express');

const { UsuariosController } = require('../controllers/usuarios-controller');

const routes = Router();

const usuarioController = new UsuariosController();


routes.get('/', usuarioController.login);

routes.post('/login', usuarioController.login);

routes.get('/login', usuarioController.mostraLogin);

routes.post('/cadastro', usuarioController.cadastro);

routes.get('/cadastro', usuarioController.mostraCadastro);

routes.get('/logout', usuarioController.logout);

module.exports = routes;