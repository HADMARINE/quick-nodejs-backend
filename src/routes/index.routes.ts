/** @format */

import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  const date: Date = new Date();
  res.send(date);
});

export default router;
