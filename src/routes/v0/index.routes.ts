import { Router } from 'express';
const router = Router();

router.all('*', (req, res) => {
  res.send('SORRY, ITS DEPRECATED');
});

export default router;
