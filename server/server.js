require('./config/config');
require('colors');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const opcionesGet = require('./middlewares/opcionesGet');

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(opcionesGet);

app.use('/api', require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then((resp) => {
    console.log('[SERVER]'.green, `Database Online`);
}).catch((err) => {
    console.log('[SERVER]'.red, `Connection Failed: ${err}`);
});

app.use((req, res, next) => {
    return res.status(404).send({
        resp: '404',
        err: true,
        msg: `URL ${req.url} Not Found`,
        cont: {}
    });
});

server = app.listen(process.env.PORT, () => {
    console.log('[SERVER]'.green, `PORT:${process.env.port}`);
});