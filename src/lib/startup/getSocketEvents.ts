import path from 'path';
import fs from 'fs';

export default function getEvents() {
  const eventPath: string = path.resolve(__dirname, '../../io/routes');
  const files = fs.readdirSync(eventPath);

  const eventList: {
    raw: Record<string, any>;
    controlled: Record<string, any>;
  } = { raw: {}, controlled: {} };

  for (const f of files) {
    const file = path.join(eventPath, f);
    const stat = fs.statSync(file);

    if (stat.isDirectory()) continue;
    if (!file.match(/\.(socket|rawsocket)\.(js|ts)$/)) continue;
    let fileType: 'raw' | 'controlled';
    if (file.match(/\.socket\.(js|ts)$/)) {
      fileType = 'controlled';
    } else {
      fileType = 'raw';
    }
    const event = f.replace(/\.(socket|rawsocket)\.(js|ts)$/, '');

    Object.assign(eventList[fileType], { [event]: require(file).default });
  }
  return eventList;
}
