import { Router } from 'express';

import Controller from './index.controller';

const router = Router();

router.all('/', Controller.getIndex);

export default router;
