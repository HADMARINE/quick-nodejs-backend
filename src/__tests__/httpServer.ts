import supertest from 'supertest';
import Test from '@util/Test';

describe('Test V1 Router', () => {
  it('should return result true', async () => {
    const res = await supertest.agent((await Test.server.create())).get('/v1');
    await Test.server.close();
    expect(res.body.result).toBe(true);
  });
});
