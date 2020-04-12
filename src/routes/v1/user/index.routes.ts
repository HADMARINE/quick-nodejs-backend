import { Router } from 'express';

import Controller from './index.controller';

const router = Router();

router.post('/', Controller.createUser);

export default router;
