const bcrypt = require('bcrypt');
const { Usuario, UsuarioDAO } = require('../models/usuario');


class UsuariosController {
    async mostraCadastro(req, res) {
        return res.render('cadastro', {});
    }
    async cadastro(req, res) {
        const usuarioBody = req.body;
        const usuarioEcontrado = await UsuarioDAO.buscaPeloEmail(usuarioBody.email);
        if (usuarioEcontrado) {
            const msg = {}; msg.titulo = "E-mail em uso";
            msg.mensagem = "Este e-mail já está em uso em um cadastro no Mensageria Chat. Tente fazer login.";
            return res.render('login', { msg: msg });
        } else {
            const senha = bcrypt.hashSync(usuarioBody.senha, 10);
            const usuario = new Usuario(usuarioBody.email, usuarioBody.nome, senha);
            await UsuarioDAO.cadastrar(usuario);
            req.session.usuario = usuario;
            return res.redirect('/');
        }
    }
    async mostraLogin(req, res) {
        return res.render('login', {});
    }
    async login(req, res) {
        const { email, senha } = req.body;
        const usuarioEcontrado = await UsuarioDAO.buscaPeloEmail(email);

        const msg = {};
        msg.titulo = "Tente novamente";
        msg.mensagem = "Email ou senha inválidos.";
        if (!usuarioEcontrado) {
            return res.render('login', { msg: msg });
        } else {
            const confere = bcrypt.compareSync(senha, usuarioEcontrado.senha);
            if (confere) {
                req.session.usuario = usuarioEcontrado;
                return res.redirect('/');
            } else {
                return res.render('login', { msg: msg });
            }
        }
    }
    async logout(req, res) {
        req.session.usuario = null;
        return res.redirect("usuarios/login")
    }
}

module.exports = { UsuariosController };
