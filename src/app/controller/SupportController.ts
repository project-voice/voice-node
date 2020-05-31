import { Controller, BaseController, Inject, Params, Get } from 'kever'
import { createResultData } from '../utils'

@Controller('/support')
export default class SupportController extends BaseController {
  @Inject('support')
  public supportService

  @Get('/support')
  async support(@Params(['query']) params) {
    let resultData
    try {
      const { target_id: targetId, user_id: userId, type } = params
      const result = await this.supportService.support(userId, targetId, type, this.ctx.db)
      if (!result) {
        throw new Error('请求失败')
      }
      resultData = createResultData({
        message: '请求成功',
        data: result
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