import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'

@Controller('/user')
export default class UserController extends BaseController {
  @Inject('user')
  private userService
  @Post('/register')
  async register(@Params(['body']) params) {
    try {
      const result = await this.userService.register(params, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Post('/login')
  async login(@Params(['body']) params) {
    try {
      const { user_name: username, user_password: password, user_email: email } = params

      const result = await this.userService.login(username, email, password, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Post('/forget-password')
  async forgetPassword(@Params(['body']) params) {
    try {
      const { user_id: userid, user_password: password } = params
      const result = await this.userService.forgetPassword(userid, password, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
}
