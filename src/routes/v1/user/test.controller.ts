import Controller from '@lib/blueprint/Controller';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();

    this.router.get(
      '/admin',
      this.assets.apiRateLimiter(1, 20),
      this.auth.authority.admin,
      this.checkUserLogin,
    );
    this.router.get(
      '/user',
      this.assets.apiRateLimiter(1, 20),
      this.auth.authority.user,
      this.checkUserLogin,
    );
  }

  private checkUserLogin = this.Wrapper((req, res) => {
    this.Response(res, 200);
  });
})();