const { dbcon } = require("../config/connection-db");
const { UsuarioGrupo, UsuarioGrupoDAO } = require('../models/usuariogrupo');

class Grupo {
    constructor(id, nome, emailCriador, dataCriacao) {
        this.id = id;
        this.nome = nome;
        this.emailCriador = emailCriador;
        this.dataCriacao = dataCriacao;
    }
}

class GrupoDAO {

    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM GRUPO WHERE ID = $1';
        const result = await dbcon.query(sql, [id]);
        const grupo = new Grupo(result.rows[0].id, result.rows[0].nome, result.rows[0].emailCriador, result.rows[0].dataCriacao);
        return grupo;
    }
    static async buscaTodosComMembros() {
        const sql = 
        `SELECT 
            GRUPO.NOME, COUNT(*) AS MEMBROS
        FROM GRUPO
        INNER JOIN USUARIOGRUPO 
            ON GRUPO.ID = USUARIOGRUPO.IDGRUPO
        GROUP BY GRUPO.ID`;
        const result = await dbcon.query(sql);
        return result.rows;
    }

    static async cadastrar(grupo) {

        const result = await dbcon.query("SELECT CASE WHEN (SELECT COUNT(*) FROM GRUPO) > 0 THEN nextval('grupo_id_seq'::regclass) ELSE 1 END AS nextval");
        const proximoId = result.rows[0].nextval;

        const sql = 'INSERT INTO GRUPO (ID, NOME, EMAILCRIADOR, DATACRIACAO) VALUES ($1, $2, $3, $4);';
        const values = [proximoId, grupo.nome, grupo.emailCriador, grupo.dataCriacao];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }

        const usuarioGrupo = new UsuarioGrupo(grupo.emailCriador, proximoId, 'admin');
        UsuarioGrupoDAO.cadastrar(usuarioGrupo);
    }

}

module.exports = {
    Grupo,
    GrupoDAO
};