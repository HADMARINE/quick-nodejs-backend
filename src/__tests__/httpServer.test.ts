import supertest, { SuperAgentTest } from 'supertest';
import Test from '@util/Test';
import Assets from '@util/Assets';
import http from 'http';

let agent: SuperAgentTest;
let server: http.Server;

beforeAll(async () => {
  server = await Test.server.create();
  agent = supertest.agent(server);
});

describe('Server status tester', () => {
  it('GET /status', async () => {
    const res = await agent.get('/status');
    expect(res.text).toBe('UP');
  });

  it('GET /info', async () => {
    const res = await agent.get('/info');
    expect(res.body.data.v1).toBe(process.env.NODE_ENV);
  });
});

describe('Request parameters validator test', () => {
  it('POST /test - truthy', async () => {
    const res = await agent.post('/test').send({ obj: [1, 2, 3, 4] });
    expect(res.body.result).toBe(true);
  });
  it('POST /test - falsy', async () => {
    const res = await agent.post('/test').send({ obj: 'FALSY TXT!' });
    expect(res.body.result).toBe(false);
  });
});

describe('Test Auth system', () => {
  const testid = `TEST_ACCOUNT_${Date.now()}`;
  const testpw = `${Date.now()}_${Assets.getRandomNumber(1000, 9999)}`;
  let token: string;
  let refreshToken: string;

  it('should create user via POST /v1/user', async () => {
    const res = await agent
      .post('/v1/user')
      .send({ userid: testid, password: testpw });
    expect(res.body.result, res.body.message).toBe(true);
  });

  it('should login and get token via POST /v1/auth', async () => {
    const res = await agent
      .post('/v1/auth')
      .send({ userid: testid, password: testpw });

    expect(res.body.result, res.body.message).toBe(true);

    token = res.body.data.access;
    refreshToken = res.body.data.refresh;
  });

  it('should get user correctly via GET /v1/user', async () => {
    const res = await agent.get('/v1/user').set({ 'x-access-token': token });

    expect(res.body.result, res.body.message).toBe(true);
    expect(res.body.data.userid).toBe(testid.toLowerCase());
  });

  it('should change user password via PATCH /v1/user and login successfully', async () => {
    const res = await agent
      .patch('/v1/user')
      .set({ 'x-access-token': token })
      .send({ password: 'password' });
    const res2 = await agent
      .post('/v1/auth')
      .send({ userid: testid, password: 'password' });

    expect(res.body.result, res.body.message).toBe(true);
    expect(res2.body.result, res2.body.message).toBe(true);
  });

  it('should refresh token via POST /v1/auth/resign', async () => {
    const res = await agent
      .post('/v1/auth/resign')
      .send({ token: refreshToken });

    expect(res.body.result, res.body.message).toBe(true);
  });

  it('should delete user via DELETE /v1/user', async () => {
    const res = await agent.delete('/v1/user').set('x-access-token', token);
    expect(res.body.result, res.body.message).toBe(true);
  });
});

afterAll(async () => {
  await Test.server.close();
});
