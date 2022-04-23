const { Grupo, GrupoDAO } = require('../models/grupo');


class GruposController {
    async mostraCadastro(req, res) {
        return res.render('grupos/cadastro');
    }
    async cadastro(req, res) {
        const grupoBody = req.body;
        const grupo = new Grupo(null, grupoBody.nome, req.session.usuario.email, new Date());
        await GrupoDAO.cadastrar(grupo);
        res.redirect('/');
    }

    async mostraListagemGeral(req, res){
        const grupos = await GrupoDAO.buscaTodosComMembros();
        return res.render('grupos/listagemGeral', {grupos})
    }

}

module.exports = { GruposController };
