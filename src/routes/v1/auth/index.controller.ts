import Controller from '@lib/blueprint/Controller';
import User from '@models/User';
import Authorization from '@util/Authorization';

export default new (class extends Controller {
  public signInUser = this.Wrapper(async (req, res) => {
    const { userid, password } = req.body;
    const user = await User.findOne({ userid }).exec();
    if (!user) throw this.error.db.notfound();
    if (!Authorization.password.verify(password, user.password, user.enckey)) {
      throw this.error.authorization.passwordinvalid();
    }
    const token = await Authorization.token.create.initial({
      _id: user._id,
      userid: user.userid,
    });
    this.Response(res, 200, { token }, { message: 'Login successful' });
  });

  public resignAccessToken = this.Wrapper(async (req, res) => {});
})();
