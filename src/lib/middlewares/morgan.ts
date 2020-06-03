import fs from 'fs';
import morgan from 'morgan';
import express from 'express';

export default function (): express.RequestHandler {
  if (!fs.existsSync('tmp')) {
    fs.mkdirSync('tmp');
  }
  if (!fs.existsSync('tmp/file')) {
    fs.mkdirSync('tmp/file');
  }
  return morgan(
    '[:date[iso]]: :method :url - :status(:total-time[3]ms) [:remote-addr :user-agent HTTP::http-version]',
    {
      stream: fs.createWriteStream('tmp/access.log', {
        flags: 'a',
      }),
    },
  );
}
