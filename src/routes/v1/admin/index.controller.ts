import Controller from '@lib/blueprint/Controller';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.get('/users', this.auth.authority.admin, this.returnWorld);
    this.router.get('/user/:userid');
    this.router.delete('/token');
  }

  private returnWorld = this.Wrapper(async (req, res) => {
    this.Response(res, 200, {}, { additionalData: { hello: 'world' } });
  });
})();
