import { Controller, BaseController, Inject, Get, Params } from 'kever'
import { createResultData } from '../utils'

@Controller('/email')
export default class EmailController extends BaseController {
  @Inject('email')
  public emailService

  @Inject('user')
  public userService

  @Get('/send-email')
  async sendEmail(@Params(['query']) params) {
    let resultData
    try {
      const { user_email: userEmail, type } = params
      const userInfo = await this.userService.findUser('user_email', userEmail, this.ctx.db)
      if (type == 'register') {
        if (userInfo) {
          this.ctx.body = createResultData({
            noerr: 1,
            message: '该邮箱已注册',
          })
          return
        }
      }
      const result = await this.emailService.sendEmail(userEmail, this.ctx.redis)
      if (!result) {
        throw new Error('验证码发送失败')
      }
      resultData = createResultData({
        message: '发送成功',
        data: userInfo
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/check-identity')
  async checkIdentity(@Params(['query']) params) {
    let resultData
    try {
      const { user_email: userEmail, identity } = params
      const result = await this.emailService.checkIdentity(userEmail, identity, this.ctx.redis)
      if (!result) {
        throw new Error('验证失败')
      }
      resultData = createResultData({
        message: '验证成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
}
