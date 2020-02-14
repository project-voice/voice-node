import { Controller, BaseController, Inject, Get, Params } from 'kever'

@Controller('/email')
export default class EmailController extends BaseController {
  @Inject('email')
  public emailService

  @Get('/send-email')
  async sendEmail(@Params(['query']) params) {
    try {
      const address = params.address
      const result = await this.emailService.sendEmail(address, this.ctx.redis)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Get('/check-identity')
  async checkIdentity(@Params(['query']) params) {
    try {
      const { address, identity } = params
      const result = await this.emailService.checkIdentity(address, identity, this.ctx.redis)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
}
