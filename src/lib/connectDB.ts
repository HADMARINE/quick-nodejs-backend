import mongoose from 'mongoose';
require('dotenv').config();

const MONGO_URL = 'mongodb://' + process.env.DB_HOST;
const env = process.env.NODE_ENV || 'development';

const auth: any = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};

const mongoURL: any = MONGO_URL;
let dbName: any = process.env.DB_NAME;

if (env !== 'production') dbName += `_${env}`;
if (env === 'development') {
  mongoose.set('debug', true);
}

module.exports = () =>
  mongoose.connect(mongoURL, {
    ...auth,
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
