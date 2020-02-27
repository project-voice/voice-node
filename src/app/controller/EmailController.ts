import { Controller, BaseController, Inject, Get, Params } from 'kever'

@Controller('/email')
export default class EmailController extends BaseController {
  @Inject('email')
  public emailService

  @Inject('user')
  public userService

  @Get('/send-email')
  async sendEmail(@Params(['query']) params) {
    const { user_email: userEmail, type } = params;
    const userInfo = await this.userService.emailToUser(userEmail, this.ctx.db)
    if (type == 'register') {
      if (userInfo) {
        this.ctx.body = {
          noerr: 1,
          message: '该邮箱已注册',
          data: null
        }
        return;
      }
    }
    const result = await this.emailService.sendEmail(userEmail, this.ctx.redis)
    this.ctx.body = Object.assign({},result, {
      data: userInfo
    })
  }
  @Get('/check-identity')
  async checkIdentity(@Params(['query']) params) {
    const { user_email: userEmail, identity } = params
    const result = await this.emailService.checkIdentity(userEmail, identity, this.ctx.redis)
    this.ctx.body = result
  }
}
