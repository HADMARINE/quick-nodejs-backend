import Controller from '@lib/blueprint/Controller';
import Session from '@models/Session';
import User from '@models/User';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.get('/users', this.auth.authority.admin);
    this.router.get('/user/:userid', this.auth.authority.admin, this.getUser);
  }

  private getUser = this.Wrapper(async (req, res) => {
    const { userid } = req.body;
    this.assets.checkNull(userid);
    const user = await User.findOne({ userid }).exec();
  });
})();
