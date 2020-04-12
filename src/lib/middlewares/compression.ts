import { Response, Request } from 'express';
import Compression from 'compression';

export default function compression(req: Request, res: Response) {
  return Compression({ filter: shouldCompress });
}

function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return Compression.filter(req, res);
}
