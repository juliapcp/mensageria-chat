const { Grupo, GrupoDAO } = require('../models/grupo');
const { Mensagem, MensagemDAO } = require('../models/mensagem');
const { UsuarioDAO } = require('../models/usuario');
const { UsuarioGrupo, UsuarioGrupoDAO } = require('../models/usuariogrupo');

class GruposController {
    async mostraCadastro(req, res) {
        return res.render('grupos/cadastro');
    }
    async cadastro(req, res) {
        const grupoBody = req.body;
        const grupo = new Grupo(null, grupoBody.nome, req.session.usuario.email, null);
        const id = await GrupoDAO.cadastrar(grupo);
        res.redirect('/grupos/'+id+'/adicionarMembro');
    }
    async mostraAdicionarMembro(req, res) {
        const { idGrupo } = req.params;
        const grupo = await GrupoDAO.buscaPeloId(idGrupo);
        if(grupo){
            return res.render('grupos/adicionarMembro', {grupo});
        } else {
            res.redirect("/notfound");
        }
    }
    async adicionaMembro(req, res) {
        const { idGrupo} = req.params;
        const { emailUsuario, permissao } = req.body;
        const grupo = await GrupoDAO.buscaPeloId(idGrupo);
        const msg = {};
        if (grupo) {
            const usuario = await UsuarioDAO.buscaPeloEmail(emailUsuario);
            if(usuario){
                const usuarioGrupo = await UsuarioGrupoDAO.buscaUsuarioGrupo(idGrupo, emailUsuario);
                if (usuarioGrupo) {
                    msg.titulo = "Usuário já é membro do grupo";
                    msg.mensagem = "Ops, este usuário já é membro do grupo!";
                    return res.render('grupos/adicionarMembro', { msg, grupo });
                } else {
                    const usuarioGrupo = new UsuarioGrupo(null, emailUsuario, idGrupo, permissao);
                    UsuarioGrupoDAO.cadastrar(usuarioGrupo);
                    res.redirect("/");
                }
            } else {
                msg.titulo = "Usuário não encontrado";
                msg.mensagem = "Ops, este usuário não existe no nosso sistema. 🤔";
                return res.render('grupos/adicionarMembro', { msg, grupo });
            }
            
        } else {
            res.redirect("/grupos/cadastro");
        }
    }

    async eliminaMembro(req, res) {
        const { idGrupo, emailUsuario } = req.params;
        const grupo = await GrupoDAO.buscaPeloId(idGrupo);
        if (grupo) {
            const usuario = await UsuarioDAO.buscaPeloEmail(emailUsuario);
            if (usuario) {
                await UsuarioGrupoDAO.eliminaUsuarioGrupo(idGrupo, emailUsuario);

            }
        }
        if(req.session.usuario.email == emailUsuario){
            res.redirect("/");
        } else {
            res.redirect("/mensagens/"+idGrupo);
        }
    }
    async mostraListagemGeral(req, res){
        const pagina = req.params.pagina || 1;
        const registrosPagina = 5;
        const retorno = await GrupoDAO.buscaTodosComMembros(registrosPagina, pagina);
        return res.render('grupos/listagemGeral', { grupos: retorno.result, atual: pagina, paginas: Math.ceil(retorno.nroRegistros / registrosPagina)});
    }

    async mostraListagemPorUsuario(req, res){
        const emailUsuario = req.session.usuario.email;
        const grupos = await UsuarioGrupoDAO.buscaPeloUsuario(emailUsuario);
        return res.render('grupos/listagemPorUsuario', {grupos})
    }

}

module.exports = { GruposController };
