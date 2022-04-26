const {  GrupoDAO } = require('../models/grupo');
const { Mensagem, MensagemDAO } = require('../models/mensagem');
const {  UsuarioGrupoDAO } = require('../models/usuariogrupo');

class MensagensController {
    
    async mostraDetalhe(req, res) {
        const { idGrupo } = req.params;
        const grupo = await GrupoDAO.buscaPeloId(idGrupo);
        const membrosGrupo = await UsuarioGrupoDAO.buscaMembrosDoGrupo(idGrupo);
        const mensagens = await MensagemDAO.buscaMensagensGrupo(idGrupo, req.session.usuario.email);
        const permissaoUsuarioGrupo = await UsuarioGrupoDAO.buscarPermissaoUsuarioGrupo(idGrupo, req.session.usuario.email);
        return res.render('mensagens/detalhe', { grupo, membrosGrupo, mensagens, permissaoUsuarioGrupo });
    }

    async enviaMensagem(req, res) {
        const mensagemBody = req.body;
        const { idGrupo } = req.params;
        const mensagem = new Mensagem(null, req.session.usuario.email, null, mensagemBody.texto, idGrupo);
        await MensagemDAO.cadastrar(mensagem);
        res.redirect('/mensagens/' + idGrupo);
    }

}

module.exports = { MensagensController };
