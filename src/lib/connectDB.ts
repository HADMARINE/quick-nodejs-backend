import mongoose from 'mongoose';
require('dotenv').config();

const MONGO_URL = process.env.DB_HOST;
const env = process.env.NODE_ENV || 'development';

const auth: any = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS
};

let mongoURL: any = MONGO_URL;

if (env !== 'production') mongoURL += `_${env}`;
if (env === 'development') {
  mongoose.set('debug', true);
}

module.exports = () =>
  mongoose.connect(mongoURL, {
    ...auth,
    auth: { authdb: 'admin' }
  });
