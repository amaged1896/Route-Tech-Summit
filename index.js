import express from 'express';
import dotenv from 'dotenv';
import { appRouter } from './app.router.js';
import { connection } from './database/dbConnection.js';
dotenv.config({ path: './config.env' });
const app = express();
connection();

appRouter(app, express);
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));