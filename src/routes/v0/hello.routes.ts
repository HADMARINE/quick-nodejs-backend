import { Router } from 'express';
const router = Router();

import Controller from './hello.controller';

router.get('/', Controller.returnWorld);
router.get('/world', Controller.returnError);

export default router;
