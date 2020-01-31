# Typescript-Node-Express-Mongodb-backend

Backend boilerplate codes for developing backend by typescript<br/><br/>
<i>Default database package is currently [<b>Mongoose</b>](https://www.npmjs.com/package/mongoose)<br/>
You must modify your code on your own to execute without mongoose.<br/><br/>

Please contribute your modified code at our organization, then we will add some repositories. Thank you! :)
</i>

# How to use

## Router

place your file in routes like :
<code>/routes/YOUR_ROUTE/index.ts</code><br/>
and, export like : <code>module.exports = router;</code><br/>
Then automated code will route your files :)

## Error Handling (throwError.ts)

We made some boilerplate errors on <code>./src/error/index.ts</code>. <br/>
We suggest to use this method because if you create your own error every time,<br/> **integrity of error datas would be broken** and can cause side-effects.<br/>
So, if you can, declare error on <code>./src/error/index.ts</code> and use.

### How to create error

First, import throwError module.

```typescript
import throwError from 'YOUR_DIR_HERE/lib/throwError.ts';
```

<br/>

And, throw your error like :

```typescript
throwError(
  ERROR_MESSAGE,
  HTTP_ERROR_CODE_NUMBER,
  ERROR_REASON_STRING,
  OPTIONS
);
```

<br/>

##### Description

<code>ERROR_MESSAGE</code> is string type, it will explain why the error has occured.<br/>
<code>HTTP_ERROR_CODE_NUMBER</code> is number type, it will return HTTP Status code.<br/>
<code>ERROR_REASON_STRING</code> is string type, you may use this data for managing exceptions.<br/>
<code>OPTIONS</code> is Object type. You can give factors below. It is not a required factor.<br/>

```json
{
  "log": true
} //Will print log on console.
```

##### Example

```typescript
throwError('Login failed', 400, 'LOGIN_FAIL');
throwError('Page not found', 404, 'PAGE_NOT_FOUND', { log: true });
```

### Suggest

Declare error with OOP-like style to maintain your error easily.

#### Legacy code

###### Declaration

```typescript
export const PageNotFound = (directory: string = '') => {
  let errorMessage = 'Page Not found.';
  if (directory) {
  }
  throwError(errorMessage, 404, 'PAGE_NOT_FOUND');
};
```

###### Import and usage

```typescript
import { PageNotFound } from './src/error/index';
...

// 404
app.use(req => {
  PageNotFound(req.url);
});
```

#### Improved code (OOP Style)

###### Declaration

```typescript
export default {
  PageNotFound(directory: string = '') {
    let errorMessage = 'Page Not found.';
    if (directory) {
      errorMessage += ` Request Directory : ${directory}`;
    }
    throwError(errorMessage, 404, 'PAGE_NOT_FOUND');
  }
  // NewError(){...},
  // NewError(){...},
};
```

###### Import and usage

```typescript
import Error from './src/error/index';
...
// 404
app.use(req => {
  Error.PageNotFound(req.url);
});
```

###### Pros

1. Don't need to import each errors every time since you imported default error file.
2. IDE suggests every error, so you don't need to find error every time.
3. You can divide errors by identifier like : <code>Error.identifier1.error</code>

## .env(dotenv)

### Required Factors

<code>DB_HOST</code> : mongodb host (You must not enter db name)<br/>
<code>DB_NAME</code> : mongodb database name<br/>
<code>DB_USER</code> : mongodb user<br/>
<code>DB_PASS</code> : mongodb password<br/>
<code>REQUEST_URI</code> : URI that your client will access. If you don't set your domain, cors origin uri will set to <b>\*</b> (wildcard) and cannot protect your api. If you want to set your origin uri to a wildcard, set to <b>\*</b> or if will occur warning log.

### Not Required Factors

<code>PORT</code> : Port that server app will run

## app.ts

#### From [THIS](https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend/commit/02a7255290b81c49f3770f6fbaae4703069c963c) version, cors settings will be automated. Set your .env file properly.

~~You should change your domain on Production build.<br/>
To change your domain, Open /src/app.ts and modify your domain on line <b>14</b>.~~
