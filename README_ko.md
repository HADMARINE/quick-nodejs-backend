# 경고: README가 최근 변동사항에 대해 업데이트가 되지 않았습니다.

# Typescript-Node-Express-Mongodb-backend

### 설명

타입스크립트로 백엔드를 제작하기 위한 보일러플레이트 코드

### 만든 계기와 템플릿의 지향점

저는 항상 Node.js 프로젝트를 생성할때마다 여러 설정과 세팅을 해주어야 하는것에 대해 굉장히 불만이 많았습니다. 그래서 저는 처음에, 기존 프로젝트를 복사해서 새로운 프로젝트에 맞게 바꾸어 사용했는데, 프로젝트마다 설정과 디펜던시등 너무나 다양한 설정들 때문에 항상 많은 오류를 뿜어 좋은 방법은 아니었습니다. 그러던 중, 저는 Node.js 백엔드 코드의 보일러 플레이트를 제작하기로 마음먹었습니다.
이 보일러플레이트 코드는 여러분이 Node.js 초기 설정을 하는 시간을 아낄 뿐만 아니라, 귀찮고 짜증나는 초기 설정이 아닌 여러분만의 로직이나, 알고리즘, 코드들을 제작하는 데 시간을 더 투자할 수 있게 도와주기 위해서 생성되었습니다. <b>즐코딩!</b>

### 정보 (기술 스택)

기본적으로 설정되어있는 ODM (오브젝트 데이터 맵핑) 패키지는 [<b>Mongoose</b>](https://www.npmjs.com/package/mongoose) 입니다.<br/>
Mongoose 를 사용하지 않고 프로젝트를 실행하려면 별도로 코드를 수정하셔야 합니다.

### 제안

여러분이 수정한 코드를 저희 Organization에 기여해주시면 리포지토리를 생성해 드리겠습니다. 감사합니다! :)

# 사용법

## 클론

<code>git clone --depth 1 --single-branch https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend "본인의 프로젝트 이름"</code>

## 서버 실행법

### 1. 라우팅

여러분의 파일을 다음과 같이 생성하고 작성하세요:
<code>/routes/YOUR_ROUTE/index.routes.ts</code><br/>
그리고 다음과 같이 export 하세요 : <code>export default router;</code><br/>
이제 자동화된 코드가 당신의 파일들을 자동으로 라우팅 해줄 것입니다 :)

<b>주의! 파일명이 \*.routes.ts 나 \*.routes.js 가 아닐 경우 라우팅에서 제외됩니다!</b>

### 2. 명령

터미널(또는 cmd)에 <code>yarn dev</code> 를 실행하세요.<br/>
만약 포트(기본 포트는 4000 입니다)가 이미 사용중이라면, 자동으로 다른 포트를 찾아 서버 실행을 시도할 것입니다.<br/>
이런 기능을 원하지 않는다면, <code>.env</code> 의 <code>PORT_STRICT</code> 값을 <b>true</b>로 설정하세요.

## 에러 핸들링 (예외처리) - (throwError.ts)

이미 기본적인 오류를 <code>./src/error/ErrorDictionary.ts</code> 에 작성해 두었습니다. <br/>
저는 위의 파일에 작성된 방식으로 오류를 처리하기를 권장하는데, 매번 같은 오류를 작성하다 보면, 같은 오류인데도 오류 코드가 다르거나, 메세지가 달라 **오류 정보에 대한 무결성이 깨져** 사이드 이펙트를 일으킬 수 있기 때문입니다.<br/>

그러므로, 가능하면 예외 처리를 <code>./src/error/ErrorDictionary.ts</code> 에 선언하시고 사용하세요.

### 오류를 생성하는 방법

먼저, <code>throwError</code> 모듈을 import 하세요.

```typescript
import throwError from 'YOUR_DIR_HERE/lib/throwError.ts';
```

<br/>

그 다음, 다음과 같이 예외처리를 하세요 :

```typescript
throwError(ERROR_MESSAGE, HTTP_ERROR_CODE_NUMBER, ERROR_REASON_STRING, OPTIONS);
```

<br/>

##### 설명

<code>ERROR_MESSAGE</code> 는 string 타입이며, 왜 오류가 발생했는지 서술합니다.<br/>
<code>HTTP_ERROR_CODE_NUMBER</code> 는 number 타입이며, 이는 HTTP 상태 코드를 넘겨줍니다.<br/>
<code>ERROR_REASON_STRING</code> 는 string 타입이며, 이로 예외를 처리할 때 에러 구분을 위해 사용할 수 있습니다.<br/>
<code>OPTIONS</code> 는 Object 타입이며, 아래에 있는 옵션을 줄 수 있습니다. 필수 항목이 아닙니다.<br/>

```json
{
  "log": true
} //Will print log on console.
```

##### 예시

```typescript
throwError('Login failed', 400, 'LOGIN_FAIL');
throwError('Page not found', 404, 'PAGE_NOT_FOUND', { log: true });
```

### 제안

예외 처리를 OOP 스타일로 작성하여 에러를 관리하기 편하게 사용하세요.

#### 기존 코드

###### 선언

```typescript
export const PageNotFound = (directory: string = '') => {
  let errorMessage = 'Page Not found.';
  if (directory) {
  }
  throwError(errorMessage, 404, 'PAGE_NOT_FOUND');
};
```

###### import 와 사용

```typescript
import {PageNotFound} from './ErrorDictionary';

...

// 404
app.use(req => {
  PageNotFound(req.url);
});
```

#### 개선된 코드 (OOP 스타일)

###### 선언

```typescript
export default {
  PageNotFound(directory: string = '') {
    let errorMessage = 'Page Not found.';
    if (directory) {
      errorMessage += ` Request Directory : ${directory}`;
    }
    throwError(errorMessage, 404, 'PAGE_NOT_FOUND');
  },
  // NewError(){...},
  // NewError(){...},
};
```

###### import 와 사용

```typescript
import Error from './ErrorDictionary';

...
// 404
app.use(req => {
  Error.PageNotFound(req.url);
});
```

###### 장점

1. 매번 각각의 에러를 import 할 필요 없이 큰 Error 모듈만 불러와서 사용하면 됩니다.
2. IDE에서 모든 에러를 제안해주므로 매번 에러를 찾아서 작성할 필요가 없습니다.
3. 다음과 같이 오류를 분리할 수 있습니다 : <code>Error.identifier1.error</code>

## .env(dotenv)

### 필수 입력 항목

<code>DB_HOST</code> : mongodb 호스트 (uri) (DB 이름을 작성하면 안됩니다. 호스트만 작성하여야 합니다.)<br/>
<code>DB_NAME</code> : mongodb 데이터베이스 이름<br/>
<code>DB_USER</code> : mongodb 유저 (id)<br/>
<code>DB_PASS</code> : mongodb 비밀번호<br/>
<code>REQUEST_URI</code> : 클라이언트가 접속할 URI 주소입니다. 만약 도메인 설정을 하지 않을 경우 cors origin uri가 <b>\*</b> (와일드카드) 로 설정되어 외부에서 들어오는 모든 요청을 받아 당신의 api를 보호할 수 없습니다. 만약 와일드카드로 도메인을 설정하고 싶으면 <b>\*</b> 로 도메인을 설정하여 경고 메세지가 발생하지 않도록 하세요.

### 선택 입력 항목

<code>PORT</code> : 서버가 올라갈 포트 입니다.<br/>
<code>PORT_STRICT</code> : 만약 자동 포트 감지를 사용하지 않고 당신이 설정한 포트만 사용하고 싶으면 이 값을 <b>true</b> 로 설정하세요.

## app.ts

#### [해당](https://github.com/WebBoilerplates/Typescript-Node-Express-Mongodb-backend/commit/02a7255290b81c49f3770f6fbaae4703069c963c) 커밋 버전부터는, cors origin uri 가 자동으로 설정되게 됩니다. .env 파일을 정확하게 설정하세요.

~~상용 빌드에서는 당신의 도메인으로 설정해야 합니다.<br/>
도메인을 변경하고 싶으시면, /src/app.ts 을 열어 <b>14</b>번째 줄의 도메인 정보를 변경하세요.~~

### 모든 코드는 HADMARINE 에게 저작권이 있으며, MIT 라이선스에 의해 사용될 수 있습니다.

Copyright 2020 HADMARINE, All rights reserved.
