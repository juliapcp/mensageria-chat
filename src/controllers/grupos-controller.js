const { Grupo, GrupoDAO } = require('../models/grupo');


class GruposController {
    async mostraCadastro(req, res) {
        return res.render('grupos/cadastro');
    }
    async cadastro(req, res) {
        
    }

}

module.exports = { GruposController };
