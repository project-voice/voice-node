import { Controller, BaseController, Inject, Get, Params } from 'kever'
import { createResultData } from '../utils'

@Controller('/follow')
export default class FollowController extends BaseController {
  @Inject('follow')
  public followService
  @Inject('user')
  public userService
  @Get('/follow')
  async follow(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userid, follow_id: followid } = params
      const result = await this.followService.follow(userid, followid, this.ctx.db)
      if (!result) {
        throw new Error('关注失败')
      }
      resultData = createResultData({
        message: '关注成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/follow-list')
  async getFollowList(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId } = params
      let result = await this.followService.getFollowList(userId, this.ctx.db)
      if (!result) {
        throw new Error('获取失败')
      }
      result = result.filter(user => user.followuser_id != userId)
      //  获取用户信息
      const userInfoPromise = result.map(user => {
        return this.userService.findUser('user_id', user.followuser_id, this.ctx.db)
      })
      const userInfo = await Promise.all(userInfoPromise)
      resultData = createResultData({
        message: '获取成功',
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
  @Get('/cancel-follow')
  async cancelFollow(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userid, follow_id: followid } = params
      const result = await this.followService.cancelFollow(userid, followid, this.ctx.db)
      if (!result) {
        throw new Error('取消失败')
      }
      resultData = createResultData({
        message: '取消成功'
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