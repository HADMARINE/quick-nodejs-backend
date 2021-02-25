import { Response, Request, RequestHandler } from 'express';
import Compression from 'compression';

function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return Compression.filter(req, res);
}

export default function compression(
  req: Request,
  res: Response,
): RequestHandler {
  return Compression({ filter: shouldCompress });
}
