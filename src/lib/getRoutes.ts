import fs from 'fs';
import path from 'path';
import { Router } from 'express';

function getPathRoutes(routePath = '/'): any {
  const routesPath = path.resolve(__dirname, '../routes', `.${routePath}`);
  const dir = fs.readdirSync(routesPath);
  const datas = [];

  for (const f of dir) {
    const file: any = path.join(routesPath, f);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      datas.push(...getPathRoutes(`${routePath.replace(/\/$/, '')}/${f}`));
      continue;
    }
    if (!file.match(/\.ts$/)) {
      continue;
    }
    const router = require(file);

    if (Object.getPrototypeOf(router) !== Router) {
      continue;
    }

    datas.push({
      path: routePath,
      router
    });
  }
  return datas;
}
function getRoutes() {
  return getPathRoutes();
}

export default getRoutes;
