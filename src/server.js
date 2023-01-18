import './config/config.js';
import('colors');

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();
import opcionesGet from './middlewares/opcionesGet.js';
import index from './routes/index.js';
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(opcionesGet);

app.use('/api', index);
mongoose
  .connect(process.env.URLDB)
  .then(() => {
    console.log('[SERVER]'.green, `Database Online`);
  })
  .catch((err) => {
    console.log('[SERVER]'.red, `Connection Failed: ${err}`);
  });

app.use((req, res, next) => {
  return res.status(404).send({
    resp: '404',
    err: true,
    msg: `URL ${req.url} Not Found`,
    cont: {},
  });
});

app.listen(process.env.PORT, () => {
  console.log('[SERVER]'.green, `PORT:${process.env.PORT}`);
});
