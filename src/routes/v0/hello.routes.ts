import { Router } from 'express';
const router = Router();

import Control from './hello.controller';

router.get('/', Control.returnWorld);

export default router;
