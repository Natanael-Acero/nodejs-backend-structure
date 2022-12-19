import express from 'express';
import user from '../routes/user.js';
const app = express();

app.use('/user', user);

export default app;
