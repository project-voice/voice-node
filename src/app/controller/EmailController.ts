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
    if (type == 'register') {
      const isExist = await this.userService.emailToUser(userEmail, this.ctx.db)
      if (isExist) {
        this.ctx.body = {
          noerr: 1,
          message: '该邮箱已注册',
          data: null
        }
        return;
      }
    }
    const result = await this.emailService.sendEmail(userEmail, this.ctx.redis)
    this.ctx.body = result
  }
  @Get('/check-identity')
  async checkIdentity(@Params(['query']) params) {
    const { user_email: userEmail, identity } = params
    const result = await this.emailService.checkIdentity(userEmail, identity, this.ctx.redis)
    this.ctx.body = result
  }
}
