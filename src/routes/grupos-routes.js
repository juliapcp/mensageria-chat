const { Router } = require('express');

const { GruposController } = require('../controllers/grupos-controller');

const routes = Router();

const grupoController = new GruposController();


routes.get('/', grupoController.mostraListagemGeral);

routes.post('/cadastro', grupoController.cadastro);

routes.get('/cadastro', grupoController.mostraCadastro);

routes.get('/listagemPorUsuario', grupoController.mostraListagemPorUsuario);

routes.get('/:idGrupo', grupoController.mostraDetalhe);

routes.get('/:idGrupo/adicionarMembro', grupoController.mostraAdicionarMembro);

routes.post('/:idGrupo/adicionarMembro', grupoController.adicionaMembro);

routes.post('/:idGrupo/enviaMensagem', grupoController.enviaMensagem);


module.exports = routes;