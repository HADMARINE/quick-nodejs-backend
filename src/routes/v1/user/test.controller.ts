import C from '@lib/blueprint/Controller';

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
    res.strict(200, undefined, {
      message: 'Successfully verified role',
    });
  });
}
