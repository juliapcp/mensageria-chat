const {  GrupoDAO } = require('../models/grupo');
const { Mensagem, MensagemDAO } = require('../models/mensagem');
const {  UsuarioGrupoDAO } = require('../models/usuariogrupo');

class MensagensController {
    
    async mostraDetalhe(req, res) {
        const { idGrupo } = req.params;
        const pagina = req.params.pagina || 1;
        const registrosPagina = 10;
        const grupo = await GrupoDAO.buscaPeloId(idGrupo);
        const membrosGrupo = await UsuarioGrupoDAO.buscaMembrosDoGrupo(idGrupo);
        const permissaoUsuarioGrupo = await UsuarioGrupoDAO.buscarPermissaoUsuarioGrupo(idGrupo, req.session.usuario.email);
        const retorno = await MensagemDAO.buscaMensagensGrupo(idGrupo, req.session.usuario.email, registrosPagina, pagina);
        return res.render('mensagens/detalhe', { grupo, membrosGrupo, mensagens: retorno.result, permissaoUsuarioGrupo, atual: pagina, paginas: Math.ceil(retorno.nroRegistros / registrosPagina)});
    }

    async enviaMensagem(req, res) {
        const mensagemBody = req.body;
        const { idGrupo } = req.params;
        const { ultimaPagina } = req.query;
        const mensagem = new Mensagem(null, req.session.usuario.email, null, mensagemBody.texto, idGrupo);
        await MensagemDAO.cadastrar(mensagem);
        res.redirect('/mensagens/' + idGrupo +'/'+(ultimaPagina || 1));
    }

}

module.exports = { MensagensController };
