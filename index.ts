/** @format */

import http from 'http';
import * as express from 'express';
import chalk from 'chalk';
const app = require('./app');
const connectDB = require('./src/lib/connectDB');
require('dotenv').config();

const router = express.Router();

const server = http.createServer(app);

const PORT = parseInt(process.env.PORT || '4000', 10);

function listen(port: number = PORT) {
  server.listen(port);
  let isError: boolean = false;
  server.once('error', (err: any) => {
    if (process.env.PORT_STRICT === 'true') {
      throw chalk.black.bgRed('ERROR:') +
        chalk.red(` Port ${port} is already in use.\n`) +
        chalk.yellow(
          'Set PORT_STRICT to false on your .env if you want to execute anyway.'
        );
    }
    if (err.code === 'EADDRINUSE') {
      console.log(
        chalk.yellow(
          `Port ${port} is currently in use. Retrying with port ${port + 1}`
        )
      );
      let newPort = port + 1;
      listen(newPort);
      isError = true;
    }
  });
  server.once('listening', () => {
    if (!isError) {
      console.log(
        chalk.black.bgGreen(`App started on port`) +
          chalk.green.bold(` ${port}`)
      );
    }
  });
}

connectDB().then(() => {
  listen();
});

module.exports = router;
