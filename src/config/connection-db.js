const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://wjbucpfgifydun:f437fa2505d7e70a80faeeaad9cc1593a88846081ffed0ee677692eeb4c3da8b@ec2-44-199-143-43.compute-1.amazonaws.com:5432/d2u2qrvlub5eft',
    ssl: {
        rejectUnauthorized: false
    }
});

dbcon.connect(err => {
    if (err) {
        console.log("Erro ao conectar ao banco de dados.");
        console.log({ err });
    }
});

module.exports = {
    dbcon
}