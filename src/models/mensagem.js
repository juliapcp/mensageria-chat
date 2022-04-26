const { dbcon } = require("../config/connection-db");

class Mensagem {
    constructor(id, emailusuario, dataenvio, texto, idgrupo) {
        this.id = id;
        this.emailusuario = emailusuario;
        this.dataenvio = dataenvio;
        this.texto = texto;
        this.idgrupo = idgrupo;
    }
}

class MensagemDAO {

    static async buscaMensagensGrupo(idGrupo, emailUsuarioSecao, registrosPagina, pagina) {
        const selectPrincipal = `SELECT 
            USUARIO.NOME AS NOMEUSUARIO,
            DATAENVIO, 
            TEXTO, 
            CASE EMAILUSUARIO WHEN $1 THEN 'RIGHT' ELSE 'LEFT' END AS POSICAO
            FROM MENSAGEM
            LEFT JOIN USUARIO ON EMAILUSUARIO = USUARIO.EMAIL 
            WHERE IDGRUPO = $2
            ORDER BY DATAENVIO ASC`;

        const sqlPaginacao =
            `SELECT
            *
        FROM
            (
            ${selectPrincipal}
            ) SUBSELECT
        ORDER BY
            SUBSELECT.DATAENVIO asc
        OFFSET (${pagina}-1) * ${registrosPagina} FETCH FIRST ${registrosPagina} ROWS ONLY;`;
        const sqlContagem =
            `SELECT
            COUNT(*) AS NROREGISTROS
        FROM
            (
            ${selectPrincipal}
            ) SUBSELECT`;
        const resultPaginacao = await dbcon.query(sqlPaginacao, [emailUsuarioSecao, idGrupo]);
        const resultContagem = await dbcon.query(sqlContagem, [emailUsuarioSecao, idGrupo]);
        const retorno = {};
        retorno.result = resultPaginacao.rows;
        retorno.nroRegistros = resultContagem.rows[0].nroregistros;
        return retorno;
    }
    
    static async cadastrar(mensagem) {
        await dbcon.query(`SET timezone=-3;`);
        const sql = `INSERT INTO mensagem
            (emailusuario, texto, idgrupo)
            VALUES($1, $2, $3);`;
        const values = [mensagem.emailusuario, mensagem.texto, mensagem.idgrupo];
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = {
    Mensagem,
    MensagemDAO
};