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
        if (result.rows[0]) {
            const grupo = new Grupo(result.rows[0].id, result.rows[0].nome, result.rows[0].emailCriador, result.rows[0].dataCriacao);
            return grupo;
        } else {
            return null;
        }
    }
    static async buscaTodosComMembros(registrosPagina, pagina) {
        const selectPrincipal = 
        `SELECT
                GRUPO.NOME,
                COUNT(*) AS MEMBROS
            FROM
                GRUPO
            INNER JOIN USUARIOGRUPO 
                    ON
                GRUPO.ID = USUARIOGRUPO.IDGRUPO
            GROUP BY
                GRUPO.ID`;
        const sqlPaginacao = 
        `SELECT
            *
        FROM
            (
            ${selectPrincipal}
            ) SUBSELECT
        ORDER BY
            SUBSELECT.MEMBROS DESC
        OFFSET (${pagina}-1) * ${registrosPagina} FETCH FIRST ${registrosPagina} ROWS ONLY;`;
        const sqlContagem = 
        `SELECT
            COUNT(*) AS NROREGISTROS
        FROM
            (
            ${selectPrincipal}
            ) SUBSELECT`;
        const resultPaginacao = await dbcon.query(sqlPaginacao);
        const resultContagem = await dbcon.query(sqlContagem);
        const retorno = {};
        retorno.result = resultPaginacao.rows;
        retorno.nroRegistros = resultContagem.rows[0].nroregistros;
        return retorno;
    }

    static async cadastrar(grupo) {
        await dbcon.query(`SET timezone=-3;`);
        const result = await dbcon.query("SELECT CASE WHEN (SELECT COUNT(*) FROM GRUPO) > 0 THEN nextval('grupo_id_seq'::regclass) ELSE 1 END AS nextval");
        const proximoId = result.rows[0].nextval;

        const sql = 'INSERT INTO GRUPO (ID, NOME, EMAILCRIADOR) VALUES ($1, $2, $3);';
        const values = [proximoId, grupo.nome.toUpperCase(), grupo.emailCriador];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }

        const usuarioGrupo = new UsuarioGrupo(null, grupo.emailCriador, proximoId, 'admin');
        UsuarioGrupoDAO.cadastrar(usuarioGrupo);

        return proximoId;
    }

}

module.exports = {
    Grupo,
    GrupoDAO
};