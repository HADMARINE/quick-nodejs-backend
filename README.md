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
First, import throwError module.<br/>
<code>import throwError from 'YOUR_DIR_HERE/lib/throwError.ts'</code><br/><br/>

And, throw your error like : <br/>
<code> throwError("ERROR_MESSAGE_HERE", ERRORCODE, OPTIONS)</code><br/><br/>

<b>Description : </b><br/>
ERRORCODE is number type, it will return HTTP Status code.<br/>
OPTIONS is Object type. You can give factors below. It is not a required factor.<br/>
<code>
{ 
  logError : true 
} //Will print log on console.
</code>

## .env(dotenv)
You must define some factors to execute server.<br/><br/>
<b>Required Factors</b><br/><br/>
<code>DB_HOST</code> : mongodb host<br/>
<code>DB_USER</code> : mongodb user<br/>
<code>DB_PASS</code> : mongodb password<br/><br/>
<b>Not Required Factors</b><br/><br/>
<code>PORT</code> : Port that server app will run

## app.ts
You should change your domain on Production build.<br/>
To change your domain, Open /src/app.ts and modify your domain on line <b>14</b>.
