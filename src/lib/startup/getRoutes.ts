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
  const invalidlyRoutedList: string[] = [];

  function detectRouterType(file: string): NodeRequire {
    let resultFile;

    if (file.match(/(.controller.ts|.controller.js)$/)) {
      resultFile = require(file).default.router;
    } else if (file.match(/(.routes.ts|.routes.js)$/)) {
      resultFile = require(file).default;
      invalidlyRoutedList.push(file);
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
        chalk.bgYellow.black(' WARNING ') +
          chalk.yellow(` File "${file}" has no default export. Ignoring...`),
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
  if (invalidlyRoutedList.length > 0) {
    debugLogger(
      chalk.bgYellow.black(' WARNING ') +
        chalk.yellow(
          ` Some files was routed by Routes routing. This type of routing could return unsafe response data, It is recommended to change it to Controller routings.`,
        ),
      false,
    );

    debugLogger(
      chalk.yellow(
        'Read Description : https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend',
      ),
      false,
    );
    debugLogger(chalk.bgYellow.black(' Invalidly Routed lists below '), false);
    invalidlyRoutedList.forEach((data, index) => {
      debugLogger(chalk.yellow(` ${index + 1}: ${data}`), false);
    });
  }
  return datas;
}

function getRoutes(): GetRoutes {
  return getPathRoutes();
}

export default getRoutes;
