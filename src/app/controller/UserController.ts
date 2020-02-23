import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'

@Controller('/user')
export default class UserController extends BaseController {
  @Inject('user')
  private userService
  @Post('/register')
  async register(@Params(['body']) params) {
    const result = await this.userService.register(params, this.ctx.db)
    this.ctx.body = result
  }
  @Post('/login')
  async login(@Params(['body']) params) {
    const { user_password: password, user_email: email } = params
    const result = await this.userService.login(email, password, this.ctx.db)
    this.ctx.body = result
  }
  @Post('/update-info')
  async updateInfo(@Params(['body']) params) {
    let { user_id: userid, key, value } = params
    if (key === 'user_image') {
      const request = this.ctx.request as any;
      value = request.files['value'];
    }
    const result = await this.userService.updateInfo(userid, key, value, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/follow')
  async follow(@Params(['query']) params) {
    const { user_id: userid, follow_id: followid } = params
    const result = await this.userService.follow(userid, followid, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/follow-list')
  async getFollowList(@Params(['query']) params) {
    const { user_id: userid } = params
    const result = await this.userService.getFollowList(userid, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/cancel-follow')
  async cancelFollow(@Params(['query']) params) {
    const { user_id: userid, follow_id: followid } = params
    const result = await this.userService.cancelFollow(userid, followid, this.ctx.db)
    this.ctx.body = result
  }
}
