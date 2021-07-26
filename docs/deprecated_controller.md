# API Document of Deprecated controller

### Some of the feature might not be implemented in the future without any announcement. Use carefully.

- Write the boilerplate code.
- Follow the description below.

```typescript
// Code from routes/index.controller.ts

import C from '@lib/blueprint/Controller';
import welcome from '@src/pages/Welcome';
import moment from 'moment';
import packageJson from '../../package.json';

export default class extends C {
  constructor() {
    super();
    // Declare your router here. this.router contains router of Express.
    this.router.all('/', this.welcome);
    this.router.get('/info', this.apiInfo);
    this.router.get('/info/time', this.timeInfo);
  }

  // RawWrapper is Wrapper that is not responsing strict json datas.
  private welcome = C.RawWrapper(async (req, res) => {
    res.send(
      welcome(
        packageJson.name,
        `${moment().format(
          'YYYY-MM-DD HH:mm:ss',
        )}<br/> See api info on <a href="/info"><b>GET /info</b></a>`,
      ),
    );
  });

  // Wrapper responses strict json response contains status code (number), message, status code(string), data, result(boolean))
  private apiInfo = C.Wrapper(async (req, res) => {
    const data = {
      v1: 'production',
    };
    // res(status code(number), data (Record<string,any>, options (ResponseOptions))
    /*
    ResponseOptions {
      result?: boolean; - strictly returns result parameter
      message?: string | null; - custom message parameter
      code?: string | null; - custom code parameter
      additionalData?: Record<string, any> | null; - return parameter outside of data parameter
    }
    */
    res.strict(200, data);
  });

  private timeInfo = C.RawWrapper(async (req, res) => {
    res.send(moment().format('YYYY-MM-DD HH:mm:ss'));
  });
}
```

Strict response example<br/>
Success

```json
{
  "status": 200,
  "code": "OK",
  "message": "Welcome to V1 API",
  "result": true,
  "data": {
    "status": "alive",
    "mode": "development",
    "version": "3.5.0"
  }
}
```

Fail

```json
{
  "status": 403,
  "message": "Token Invalid",
  "code": "TOKEN_INVALID",
  "result": false
}
```

All data except data parameters are automatic.
