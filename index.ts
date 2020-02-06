/** @format */

import http from 'http';
import * as express from 'express';
import chalk from 'chalk';
const app = require('./app');
const connectDB = require('./src/lib/connectDB');
require('dotenv').config();

const router = express.Router();

const server = http.createServer(app);

const PORT = parseInt(process.env.PORT || '4000');

function listen(port: number = PORT) {
  server.listen(port);
  let isError: boolean = false;
  server.once('error', (err: any) => {
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
