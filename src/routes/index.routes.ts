import { Router } from 'express';

const router = Router();

router.all('/', (req, res) => {
  const date: Date = new Date();
  res.send(
    `TIMENOW:${date}:<br/>See api info on <a href="/info"><b>GET /info</b></a>`,
  );
});

router.get('/info', (req, res) => {
  const data = {
    v0: 'deprecated',
    v1: 'production',
  };
  res.send(data);
});

export default router;
