import express from 'express';
const router = express.Router();

import bodyParser from 'body-parser';
import throwError from '../lib/throwError';

router.use(bodyParser.json());

router.get('/', (req: any, res: any) => {
  const date: Date = new Date();
  res.send(date);
});

module.exports = router;
