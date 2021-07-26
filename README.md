# Typescript-Node-Express-Mongodb-backend

## Readme for other languages

### [한국어 (Korean) (만료됨 Deprecated - 영어 문서를 참고해주세요.)](https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend/blob/master/docs/README_ko.md)

### Description

Backend boilerplate codes for developing backend by typescript as fast as light!

### Informations

Default database package is currently [<b>Mongoose</b>](https://www.npmjs.com/package/mongoose)<br/>
You must modify your code on your own to execute without mongoose.

## Cloning

<code>git clone --depth 1 --single-branch https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend "Your project name"</code>

# How to use

**Before of all, Please check the document of [Express-Quick-Builder](https://github.com/hadmarine/express-quick-builder), the main library of this template repository.**

## 1. HTTP Router (Express based)

Place your file in routes like :
<code>/routes/YOUR_ROUTE/index.controller/router.ts</code><br/>
Then automated code will route your files :)

<b>Warning! If the filename is not like \*.routes.ts or \*.controller.ts , auto router will not detect your file.</b>

#### Differences of _.controller.ts and _.routes.ts

- controller.ts is controlled router, your code will be guided by pre-written codes.
- routes.ts is uncontrolled router, export default express requestHandler function to execute.

##### Usage

See [express-quick-builder document](https://github.com/HADMARINE/express-quick-builder/blob/master/README.md)

## 2. Socket Event Handler

1. Place your socket event handler file on src/io/routes<br/>
   <code>foo.socket.ts</code> or <code>bar.rawsocket.ts</code>

2. Write your boilerplate code

- \*.socket.ts

```typescript
import SC from '@lib/blueprint/SocketController';

export default class extends SC {
  main() {
    //your code goes here
    //this.parameters - parameters of current event
    //this.global - socketio.Server (global io)
    //this.current - socketio.Socket (current socket event handler)
  }
}
```

<b>strict event handler will be auto assigned by file name (filename.socket.ts -> filename event listener)</b>

- \*.rawsocket.ts

```typescript
export default function (io: Socketio.Server, socket: Socketio.Socket) {
  //your code goes here
}
```

<b>raw event handler will not assign events automatically.</b>

## 3. Commands

Execute <code>yarn dev</code> on your command line.<br/>
If the port (default port is 4000) is already in use, it will try to listen on another port automatically. <br/>
If you don't want this function, set <code>PORT_STRICT</code> on your <code>.env</code> to true.

### Error Handling (returnError.ts)

We made some boilerplate errors on <code>./src/error/ErrorDictionary.ts</code>. <br/>
We suggest to use this method because if you create your own error every time,<br/> **integrity of error datas would be broken** and can cause side-effects.<br/>
So, if you can, declare error on <code>./src/error/ErrorDictionary.ts</code> and use.

## 4. Certificate Management

Use [QuickCert.js](https://github.com/HADMARINE/quickcert.js). It is not only easy, but also blazing fast and secure.

### How to create error

#### First, declare error on <code>src/error</code> file.

```typescript
returnError(
  ERROR_MESSAGE,
  HTTP_ERROR_CODE_NUMBER,
  ERROR_REASON_STRING,
  OPTIONS,
);
```

#### Next, throw your error on routing files.

```typescript
class Foo {
  private getFoo = C.Wrapper(async (req, res) => {
    throw C.error.fooError();
  });
}
```

##### Description

<code>ERROR_MESSAGE</code> is string type, it will explain why the error has occured.<br/>
<code>HTTP_ERROR_CODE_NUMBER</code> is number type, it will return HTTP Status code.<br/>
<code>ERROR_REASON_STRING</code> is string type, you may use this data for managing exceptions.<br/>
<code>OPTIONS</code> is Object type. You can give factors below. It is not a required factor.<br/>

```typescript
{
  "log": true
} //Will print log on console.
```

##### Import and usage

```typescript
import error from '@error/index';
...
// 404
app.use(req => {
  error.pageNotFound(req.url);
});
```

## 4. env(dotenv)

Create .env file on your project's root directory.

### Required Factors

<code>DB_HOST</code> : mongodb host (You must not enter db name)<br/>
<code>DB_NAME</code> : mongodb database name<br/>
<code>DB_USER</code> : mongodb user<br/>
<code>DB_PASS</code> : mongodb password<br/>
<code>REQUEST_URI</code> : URI that your client will access. If you don't set your domain, cors origin uri will set to <b>\*</b> (wildcard) and cannot protect your api. If you want to set your origin uri to a wildcard, set to <b>\*</b> or if will occur warning log.<br/>
<code>TOKEN_KEY</code> : JWT Token private key

### Not Required Factors

<code>PORT</code> : Port that server app will run<br/>
<code>PORT_STRICT</code> : Set to <b>true</b> if you don't want to use auto port-detection and use only your own port.<br/>
<code>EXAMINE_PASSWORD</code> : parameter whether double-check password encryption<br/>

## ETC

### Known Issues

- Nodemon will not run properly at version 2.0.3 and above at WIN32 (windows). Downgraded currently to 2.0.2 until fixed.
- Currently have plan to improve SocketEventHandlers and migrate to express-quick-builder or create new open source package.
- Test code coverage is currently low, Need to improve above 90 percent.

### License

All code belongs to HADMARINE. You can use this code as Apache 2.0 License.

[See details of License](https://github.com/HADMARINE/Typescript-Node-Express-Mongodb-backend/blob/master/LICENSE)

Copyright 2020 HADMARINE, All rights reserved.
