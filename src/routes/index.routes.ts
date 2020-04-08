/** @format */

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  const date: Date = new Date();
  res.send(date);
});

module.exports = router;
