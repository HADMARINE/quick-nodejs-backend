import { Router } from 'express';
const router = Router();

router.all('/', (req, res) => {
  res.status(200).send('OK');
});

export default router;
