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
      const { address, type, userid } = params.address
      // if (type === 'forgetPassword') {
      //   // 调userService下的check接口，检查用户对应的邮箱地址是否正确
      //   let checkResult = await this.userService.check({
      //     user_id: userid,
      //     user_email: address
      //   })
      //   if (checkResult.noerr === 1) {
      //     return {
      //       noerr: 1,
      //       message: '用户与邮箱不符'
      //     }
      //   }
      // }
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
