# Typescript-Node-Express-Mongodb-backend

Backend boilerplate codes for developing backend by typescript<br/><br/>
<i>Default database package is currently <b>Mongoose</b><br/>
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

<br/>
First, import throwError module.<br/>
<code>import throwError from 'YOUR_DIR_HERE/lib/throwError.ts'</code><br/><br/>

And, throw your error like : <br/>
<code> throwError("ERROR_MESSAGE", HTTP_ERROR_CODE_NUMBER, ERROR_REASON_STRING, OPTIONS)</code><br/><br/>

<b>Description : </b><br/>
ERROR_MESSAGE is string type, it will explain why the error has occured.<br/>
HTTP_ERROR_CODE_NUMBER is number type, it will return HTTP Status code.<br/>
ERROR_REASON_STRING is string type, you may use this data for managing exceptions.<br/>
OPTIONS is Object type. You can give factors below. It is not a required factor.<br/>
<code>
{
logError : true
} //Will print log on console.
</code>
<br/>
<b>Example</b><br/>
<code>throwError("Login failed",400,"LOGIN_FAIL");</code><br/>
<code>throwError("Page not found",404,"PAGE_NOT_FOUND");</code>

## .env(dotenv)

You must define some factors to execute server.<br/><br/>
<b>Required Factors</b><br/><br/>
<code>DB_HOST</code> : mongodb host (You must not enter db name)<br/>
<code>DB_NAME</code> : mongodb database name<br/>
<code>DB_USER</code> : mongodb user<br/>
<code>DB_PASS</code> : mongodb password<br/><ㅠㄱ/>

<b>Not Required Factors</b><br/><br/>
<code>PORT</code> : Port that server app will run

## app.ts

You should change your domain on Production build.<br/>
To change your domain, Open /src/app.ts and modify your domain on line <b>14</b>.
