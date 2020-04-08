import fs from 'fs';
import path from 'path';
import { Router } from 'express';

function getPathRoutes(routePath = '/'): Record<string, any>[] {
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
    if (!file.match(/(.ts|.js)$/)) {
      continue;
    }
    const router: NodeRequire = require(file).default;

    if (Object.getPrototypeOf(router) !== Router) {
      continue;
    }

    datas.push({
      path: routePath,
      router,
    });
  }
  return datas;
}

function getRoutes(): Record<string, any> {
  return getPathRoutes();
}

interface GetRoutesProps {
  path: string;
  router: NodeRequire;
}

export type { GetRoutesProps };
export default getRoutes;
