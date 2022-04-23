const { dbcon } = require("../config/connection-db");

class UsuarioGrupo {
    constructor(emailUsuario, idGrupo, permissao) {
        this.emailUsuario = emailUsuario;
        this.idGrupo = idGrupo;
        this.permissao = permissao;
    }
}

class UsuarioGrupoDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM USUARIOGRUPO WHERE ID = $1';
        const result = await dbcon.query(sql, [id]);
        const usuarioGrupo = new UsuarioGrupo(result.rows[0].id, result.rows[0].nome, result.rows[0].emailCriador, result.rows[0].dataCriacao);
        return usuarioGrupo;
    }

    static async buscaPeloUsuario(emailUsuario) {
        const sql = 'SELECT * FROM USUARIOGRUPO WHERE emailUsuario = $1';
        const result = await dbcon.query(sql, [emailUsuario]);
        return result.rows;
    }
    static async buscaPeloGrupo(idGrupo) {
        const sql = 'SELECT * FROM USUARIOGRUPO WHERE idGrupo = $1';
        const result = await dbcon.query(sql, [idGrupo]);
        return result.rows;
    }

    static async cadastrar(usuarioGrupo) {
        const sql = 'INSERT INTO USUARIOGRUPO (emailusuario, idgrupo, permissao) VALUES ($1, $2, $3);';
        const values = [usuarioGrupo.emailUsuario, usuarioGrupo.idGrupo, usuarioGrupo.permissao];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }
    }

}

module.exports = {
    UsuarioGrupo,
    UsuarioGrupoDAO
};