import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import chalk from 'chalk';
import logger, { debugLogger } from '@lib/logger';

interface GetRoutesProps {
  path: string;
  router: NodeRequire;
}

type GetRoutes = GetRoutesProps[];

function getPathRoutes(routePath = '/'): GetRoutes {
  const routesPath: string = path.resolve(
    __dirname,
    '../../routes',
    `.${routePath}`,
  );
  const dir: string[] = fs.readdirSync(routesPath);
  const datas: GetRoutes = [];

  function detectRouterType(file: string): NodeRequire {
    let resultFile;

    if (file.match(/(.controller.ts|.controller.js)$/)) {
      resultFile = require(file).default.router;
    } else if (file.match(/(.routes.ts|.routes.js)$/)) {
      resultFile = require(file).default;
      debugLogger(
        chalk.bgYellow.black(' Warning ') +
          chalk.yellow(` File "${file}" was routed by .routes.ts`),
        false,
      );
      debugLogger(
        chalk.yellow(
          'This type of routing will be deprecated soon, Please convert to .controller.ts routings!',
        ),
        false,
      );
    }
    return resultFile;
  }

  for (const f of dir) {
    const file: any = path.join(routesPath, f);
    const stat: fs.Stats = fs.statSync(file);
    if (stat.isDirectory()) {
      datas.push(...getPathRoutes(`${routePath.replace(/\/$/, '')}/${f}`));
      continue;
    }
    if (!file.match(/(.controller.ts|.controller.js|.routes.ts|.routes.js)$/)) {
      continue;
    }

    const router: NodeRequire = detectRouterType(file);

    if (!router) {
      logger(
        chalk.bgYellow.black.bold(' WARNING ') +
          chalk.yellow(`File "${file}" has no default export. Ignoring...`),
        true,
      );
      continue;
    }

    if (Object.getPrototypeOf(router) !== Router) {
      continue;
    }
    let filename: string = f.replace(
      /(.controller.ts|.controller.js|.routes.ts|.routes.js)$/,
      '',
    );
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
