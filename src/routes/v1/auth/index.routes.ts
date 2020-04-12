import { Router } from 'express';
const router = Router();

import Controller from './index.controller';

router.post('/', Controller.signInUser);
router.post('/resign', Controller.resignAccessToken);

export default router;
