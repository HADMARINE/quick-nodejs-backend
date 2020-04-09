import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('world');
});

export default router;
