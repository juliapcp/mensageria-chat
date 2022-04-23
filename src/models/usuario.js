const { dbcon } = require("../config/connection-db");

class Usuario {
    constructor(email, nome, senha) {
        this.email = email;
        this.nome = nome;
        this.senha = senha;
    }
}

class UsuarioDAO {

    static async buscaPeloEmail(email) {
        const sql = 'SELECT * FROM USUARIO WHERE EMAIL = $1';
        const result = await dbcon.query(sql, [email]);
        if (result.rows[0]){
            return new Usuario(result.rows[0].email, result.rows[0].nome, result.rows[0].senha);
        } else{
            return null;
        }
    }

    static async cadastrar(usuario) {

        const sql = 'INSERT INTO USUARIO (EMAIL, NOME, SENHA) VALUES ($1, $2, $3);';
        const values = [usuario.email, usuario.nome, usuario.senha];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = {
    Usuario,
    UsuarioDAO
};