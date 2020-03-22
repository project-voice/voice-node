import { Controller, BaseController, Get, Inject, Post, Params } from 'kever'
import { createResultData } from '../utils'

@Controller('/user')
export default class UserController extends BaseController {
  @Inject('user')
  public userService
  @Inject('follow')
  public followService

  @Post('/login')
  async login(@Params(['body']) params) {
    let resultData
    try {
      const { user_email: email, user_password: password, platform, user_name: username } = params
      let key: string
      let value: string = password
      if (platform === 'mobile') {
        key = email
        const isUser = await this.userService.findUser('user_email', key, this.ctx.db)
        if (!isUser) {
          throw new Error('您输入的邮箱未注册')
        }
      } else {
        key = username
      }
      const result = await this.userService.login(platform, key, value, this.ctx.db)
      if (!result) {
        throw new Error('登录失败')
      }
      if (result.user_status == 1) {
        throw new Error('该用户被禁用，请联系管理员处理相关信息。')
      }
      resultData = createResultData({
        message: '登录成功',
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
  @Post('/register')
  async register(@Params(['body']) params) {
    let resultData
    try {
      const { user_email: email, user_name: username, user_password: password } = params
      const result = await this.userService.createUser(email, username, password, this.ctx.db)
      if (!result) {
        throw new Error('注册失败')
      }
      // 自己关注自己
      this.followService.follow(result, result, this.ctx.db)
      resultData = createResultData({
        message: '注册成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Post('/update')
  async updateInfo(@Params(['body']) params) {
    let resultData
    try {
      let { user_id: userId, key, value } = params
      if (key === 'user_image') {
        const request = this.ctx.request as any;
        value = request.files['value'];
      }
      const result = await this.userService.updateUser(userId, key, value, this.ctx.db)
      if (!result) {
        throw new Error('更新失败')
      }
      resultData = createResultData({
        message: '更新成功',
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
  @Get('/user-list')
  async getUserList() {
    let resultData
    try {
      const result = await this.userService.getUserList(this.ctx.db)
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
  @Get('/disable-user')
  async disableUser(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId } = params
      const result = await this.userService.disableUser(userId, this.ctx.db)
      if (!result) {
        throw new Error('禁用失败')
      }
      resultData = createResultData({
        message: '禁用成功',
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
