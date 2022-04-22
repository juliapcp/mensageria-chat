const bcrypt = require('bcrypt');
const { Usuario, UsuarioDAO } = require('../models/usuario');


class UsuariosController {
    async mostraCadastro(req, res) {
        return res.render('cadastro', {});
    }
    async cadastro(req, res) {
        const usuarioBody = req.body;
        const senha = bcrypt.hashSync(usuarioBody.senha, 10); 
        const usuario = new Usuario(usuarioBody.email, usuarioBody.nome, senha);
        await UsuarioDAO.cadastrar(usuario);
        res.redirect('/');
    }
    async mostraLogin(req, res) {
        return res.render('login', {});
    }
    async login(req, res) {
        const { email, senha } = req.body;
        const usuarioEcontrado = await UsuarioDAO.buscaPeloEmail(email);

        if (!usuarioEcontrado) return res.send('Usuário não encontrado');

        const confere = bcrypt.compareSync(senha, usuarioEcontrado.senha);
        if (confere) {
            req.session.usuario = usuarioEcontrado;
            return res.send('Usuario e senha confirmados, vc fez o login');
        } else {
            return res.send('Senha nao confere...');
        }
        
    }
}

module.exports = {UsuariosController};
