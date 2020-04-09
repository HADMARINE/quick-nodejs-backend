import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import chalk from 'chalk';

interface GetRoutesProps {
  path: string;
  router: NodeRequire;
}

type GetRoutes = GetRoutesProps[];

function getPathRoutes(routePath = '/'): GetRoutes {
  const routesPath: string = path.resolve(
    __dirname,
    '../routes',
    `.${routePath}`,
  );
  const dir: string[] = fs.readdirSync(routesPath);
  const datas: GetRoutes = [];

  for (const f of dir) {
    const file: any = path.join(routesPath, f);
    const stat: fs.Stats = fs.statSync(file);
    if (stat.isDirectory()) {
      datas.push(...getPathRoutes(`${routePath.replace(/\/$/, '')}/${f}`));
      continue;
    }
    if (!file.match(/(.routes.ts|.routes.js)$/)) {
      continue;
    }
    const router: NodeRequire = require(file).default;

    if (!router) {
      console.error(
        chalk.yellow(`File "${f}" has no default export. Ignoring...`),
      );
      continue;
    }

    if (Object.getPrototypeOf(router) !== Router) {
      continue;
    }
    let filename: string = f.replace(/(.routes.ts|.routes.js)$/, '');
    filename = filename === 'index' ? '' : `/${filename}`;

    datas.push({
      path: `${routePath}${filename}`,
      router,
    });
  }
  return datas;
}

function getRoutes(): GetRoutes {
  return getPathRoutes();
}

export default getRoutes;
