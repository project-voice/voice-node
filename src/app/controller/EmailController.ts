import { Controller, BaseController, Inject, Get, Params } from 'kever'

@Controller('/email')
export default class EmailController extends BaseController {
  @Inject('email')
  public emailService

  @Inject('user')
  public userService

  @Get('/send-email')
  async sendEmail(@Params(['query']) params) {
    try {
      const userEmail = params.user_email
      const result = await this.emailService.sendEmail(userEmail, this.ctx.redis)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Get('/check-identity')
  async checkIdentity(@Params(['query']) params) {
    try {
      const { user_email: userEmail, identity } = params
      const result = await this.emailService.checkIdentity(userEmail, identity, this.ctx.redis)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
}
