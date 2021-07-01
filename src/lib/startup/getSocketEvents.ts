import path from 'path';
import fs from 'fs';

function getEventRoutes(): string[] {
  const eventDirPath = path.join(__dirname, '../../io/routes/');
  return fs.readdirSync(eventDirPath).filter((value) => {
    return fs.statSync(path.join(eventDirPath, value)).isDirectory();
  });
}

export default function getEvents(): Record<string, any> {
  const events = {};
  const eventDirRoutes = getEventRoutes();
  for (const dirs of eventDirRoutes) {
    const eventPath: string = path.resolve(__dirname, '../../io/routes/', dirs);
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

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Object.assign(eventList[fileType], { [event]: require(file).default });
    }
    Object.assign(events, { [dirs]: eventList });
  }
  return events;
}
