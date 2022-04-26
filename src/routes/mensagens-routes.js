const { Router } = require('express');

const {MensagensController } = require('../controllers/mensagens-controller');

const routes = Router();

const mensagensController = new MensagensController();

routes.get('/:idGrupo/', mensagensController.mostraDetalhe);
routes.get('/:idGrupo/:pagina', mensagensController.mostraDetalhe);

routes.post('/:idGrupo/enviaMensagem', mensagensController.enviaMensagem);

module.exports = routes;