import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import logger from '@lib/logger';

interface GetRoutesProps {
  path: string;
  router: NodeRequire;
}

type GetRoutes = GetRoutesProps[];

const invalidlyRoutedList: string[] = [];

function detectRouterTypeAndReturn(file: string): NodeRequire {
  let resultFile;
  try {
    if (file.match(/\.controller\.(ts|js)$/)) {
      resultFile = new (require(file).default)().router;
    } else if (file.match(/\.routes\.(ts|js)$/)) {
      resultFile = require(file).default;
      invalidlyRoutedList.push(file);
    }
  } catch (e) {
    logger.debug(e, false);
    resultFile = null;
  }

  return resultFile;
}

function getPathRoutes(routePath = '/'): GetRoutes {
  const routesPath: string = path.resolve(
    __dirname,
    '../../routes',
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
    if (!file.match(/\.(controller|routes)\.(js|ts)$/)) {
      continue;
    }

    const router: NodeRequire = detectRouterTypeAndReturn(file);

    if (!router) {
      logger.warn(
        `File "${file}" has no default export or have syntax error. Ignoring...`,
      );
      continue;
    }

    if (Object.getPrototypeOf(router) !== Router) {
      continue;
    }
    let filename: string = f.replace(/\.(controller|routes)\.(js|ts)$/, '');
    filename = filename === 'index' ? '' : `/${filename}`;

    datas.push({
      path: `${routePath}${filename}`,
      router,
    });
  }
  if (invalidlyRoutedList.length > 0) {
    logger.debug(`Some files was routed by Routes routing.`, false);
    logger.debug(
      `This may return unsafe response data, It is recommended to change it to Controller routings.`,
      false,
    );
    logger.debug(
      'Read Description : https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend',
      false,
    );
    logger.debug('Invalidly Routed lists below ', false);
    invalidlyRoutedList.forEach((data, index) => {
      logger.debug(`${index + 1}: ${data}`, false);
    });
  }
  return datas;
}

function getRoutes(): GetRoutes {
  return getPathRoutes();
}

export default getRoutes;
