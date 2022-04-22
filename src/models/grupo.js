const { dbcon } = require("../config/connection-db");

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
    static async buscaTodos() {
        const sql = 'SELECT * FROM GRUPO';
        const result = await dbcon.query(sql);
        return result.rows;
    }

    static async cadastrar(grupo) {

        const sql = 'INSERT INTO GRUPO (ID, NOME, EMAILCRIADOR, DATACRIACAO) VALUES ($1, $2, $3, $4);';
        const values = [grupo.id, grupo.nome, grupo.emailCriador, grupo.dataCriacao];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }
    }
}

module.exports = {
    Grupo,
    GrupoDAO
};