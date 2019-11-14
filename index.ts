import http from 'http';
const app = require('./app');
const connectDB = require('./src/lib/connectDB');
require('dotenv').config();

import * as express from 'express';
const router = express.Router();

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((e: any) => console.error(e));

module.exports = router;
