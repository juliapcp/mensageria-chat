
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/view');

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: 'oeRf3fJ4eG3flxv30XvUcuOcDwoLyJtboDql',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))


app.use(express.static('public'));

// app.get('*', (req, res, next) => {
//     if (req.url != '/usuario/login' && req.url != '/usuario/cadastro' && req.url != '/index') {
//         if (!req.session.usuario) {
//             res.redirect('/usuario/login');
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// })

// app.get('/', (req, res) => {
//     res.redirect('/filmes');
// });

const usuariosRoutes = require('./routes/usuarios-routes');
app.use('/usuarios', usuariosRoutes);

const gruposRoutes = require('./routes/grupos-routes');
app.use('/grupos', gruposRoutes);

app.use('*', (req, res) => {
    return res.status(404).send(`
        <h1>404 - NOT FOUND</h1>
    `);
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server iniciado na porta ${PORT}`));