const { Router } = require('express');

const { GruposController } = require('../controllers/grupos-controller');

const routes = Router();

const grupoController = new GruposController();


routes.get('/listagemGeral/', grupoController.mostraListagemGeral);

routes.get('/listagemGeral/:pagina', grupoController.mostraListagemGeral);

routes.post('/cadastro', grupoController.cadastro);

routes.get('/cadastro', grupoController.mostraCadastro);

routes.get('/listagemPorUsuario', grupoController.mostraListagemPorUsuario);


routes.get('/:idGrupo/adicionarMembro', grupoController.mostraAdicionarMembro);

routes.get('/:idGrupo/eliminarMembro/:emailUsuario', grupoController.eliminaMembro);

routes.post('/:idGrupo/adicionarMembro', grupoController.adicionaMembro);


module.exports = routes;