import mongoose from 'mongoose';
interface Auth {
  user: string;
  pass: string;
}

const MONGO_URL = process.env.DB_HOST;
const env = process.env.NODE_ENV || 'development';

if (!process.env.DB_USER || !process.env.DB_PASS) {
  throw new Error('DB AUTH INFO NOT PROVIDED');
}

const auth: Auth = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};

const mongoURL: any = MONGO_URL;
let dbName: any = process.env.DB_NAME;

if (env !== 'production') dbName += `_${env}`;
if (env === 'development') {
  mongoose.set('debug', true);
}

export default (): Promise<typeof mongoose | undefined> => {
  if (
    !process.env.DB_HOST ||
    !process.env.DB_NAME ||
    !process.env.DB_USER ||
    !process.env.DB_PASS
  ) {
    return new Promise((res) => {
      res(undefined);
    });
  }

  return mongoose.connect(mongoURL, {
    ...auth,
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};
