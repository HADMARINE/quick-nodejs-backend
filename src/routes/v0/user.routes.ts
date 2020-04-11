import { Router } from 'express';
import User from '@models/User';
import Assets from '@util/Assets';
import error from '@error';
import { debugLogger } from '@lib/logger';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { userid, password } = req.body;
    Assets.checkNull([userid, password]);
    const userData = await User.create({ userid, password });
    res.status(201).json({ result: true, userData });
  } catch (e) {
    next(e);
  }
});

router.post('/test', (req, res, next) => {
  try {
    throw error.access.pagenotfound();
  } catch (e) {
    next(e);
  }
});

export default router;
