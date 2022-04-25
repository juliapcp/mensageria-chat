const { dbcon } = require("../config/connection-db");

class UsuarioGrupo {
    constructor(id, emailUsuario, idGrupo, permissao) {
        this.id = id;
        this.emailUsuario = emailUsuario;
        this.idGrupo = idGrupo;
        this.permissao = permissao;
    }
}

class UsuarioGrupoDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM USUARIOGRUPO WHERE ID = $1';
        const result = await dbcon.query(sql, [id]);
        if (result.rows[0]) {
            const usuarioGrupo = new UsuarioGrupo(result.rows[0].id, result.rows[0].emailUsuario, result.rows[0].idGrupo, result.rows[0].permissao);
            return usuarioGrupo;
        } else {
            return null;
        }
    }

    static async buscaPeloUsuario(emailUsuario) {
        const sql = 'SELECT GRUPO.NOME, IDGRUPO FROM USUARIOGRUPO LEFT JOIN GRUPO ON IDGRUPO = GRUPO.ID WHERE EMAILUSUARIO = $1';
        const result = await dbcon.query(sql, [emailUsuario]);
        return result.rows;
    }

    static async buscarPermissaoUsuarioGrupo(idGrupo, emailUsuario) {
        const sql = 'SELECT PERMISSAO FROM USUARIOGRUPO WHERE IDGRUPO = $1 AND EMAILUSUARIO = $2';
        const result = await dbcon.query(sql, [idGrupo, emailUsuario]);
        return result.rows[0].permissao;
    }
    static async buscaMembrosDoGrupo(idGrupo) {
        const sql = "SELECT GRUPO.NOME AS NOMEGRUPO, USUARIO.NOME, CASE PERMISSAO WHEN 'admin' THEN 'Administrador' WHEN 'escritor' THEN 'Escritor' ELSE 'Leitor' END AS PERMISSAO FROM USUARIOGRUPO INNER JOIN USUARIO ON EMAILUSUARIO = USUARIO.EMAIL LEFT JOIN GRUPO ON IDGRUPO = GRUPO.ID  WHERE idGrupo = $1";
        const result = await dbcon.query(sql, [idGrupo]);
        return result.rows;
    }
    static async buscaUsuarioGrupo(idGrupo, emailUsuario) {
        const sql = 'SELECT * FROM USUARIOGRUPO WHERE idGrupo = $1 AND emailUsuario = $2';
        const result = await dbcon.query(sql, [idGrupo, emailUsuario]);
        if (result.rows[0]) {
            const usuarioGrupo = new UsuarioGrupo(result.rows[0].id, result.rows[0].emailUsuario, result.rows[0].idGrupo, result.rows[0].permissao);
            return usuarioGrupo;
        } else {
            return null;
        }
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