import C from '@lib/blueprint/Controller';
import User from '@models/User';

export default class extends C {
  constructor() {
    super();

    this.router.get(
      '/admin',
      C.assets.apiRateLimiter(1, 20),
      C.auth.authority.admin,
      this.checkUserLogin,
    );
    this.router.get(
      '/user',
      C.assets.apiRateLimiter(1, 20),
      C.auth.authority.user,
      this.checkUserLogin,
    );
  }

  private checkUserLogin = C.Wrapper((req, res) => {
    res(200, undefined, {
      message: 'Successfully verified role',
    });
  });
}
