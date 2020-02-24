import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'
import { getUser } from '../service/common'

@Controller('/video')
export default class VideoController extends BaseController {
  @Inject('video')
  public videoService
  @Inject('user')
  public userSevice
  @Inject('support')
  public supportService
  @Inject('comment')
  public commentService
  @Inject('message')
  public messageService

  @Get('/get-video-all')
  async getVideoListAll(@Params(['query']) params) {
    try {
      const { user_id: userid, count } = params
      let { data: followList } = await this.userSevice.getFollowList(userid, this.ctx.db)
      followList = followList.map(user => user.user_id)
      const followPromise = this.videoService.getVideoListFollow(userid, followList, count, 1, this.ctx.db)
      const recommendPromise = this.videoService.getVideoListRecommend(userid, followList, count, 1, this.ctx.db)
      const [follow, recommend] = await Promise.all([followPromise, recommendPromise])
      this.ctx.body = Object.assign({}, this.videoService.data, {
        message: '获取视频列表成功',
        data: {
          follow,
          recommend
        }
      })
    } catch (err) {
      this.ctx.body = Object.assign({}, this.videoService.data, {
        noerr: 1,
        message: '获取视频列表失败'
      })
    }
  }
  @Get('/get-video')
  async getVideoList(@Params(['query']) params) {
    try {
      const { user_id: userid, count, page, type } = params
      let result;
      let { data: followList } = await this.userSevice.getFollowList(userid, this.ctx.db)
      followList = followList.map(user => user.user_id)
      if (type === 'follow') {
        result = await this.videoService.getVideoListFollow(userid, followList, count, page, this.ctx.db)
      } else {
        result = await this.videoService.getVideoListRecommend(userid, followList, count, page, this.ctx.db)
      }
      this.ctx.body = Object.assign({}, this.videoService.data, {
        message: '获取视频列表成功',
        data: result
      })
    } catch (err) {
      this.ctx.body = Object.assign({}, this.videoService.data, {
        noerr: 1,
        message: '获取视频列表失败'
      })
    }
  }
  @Get('/support')
  async support(@Params(['query']) params) {
    const { user_id: userid, video_id: videoid } = params
    const result = await this.supportService.support(userid, videoid, 0, this.ctx.db)
    this.ctx.body = result
  }
  @Post('/release-video')
  async releaseVideo(@Params(['body']) params) {
    const request = this.ctx.request as any;
    const video = request.files['video']
    const { user_id: userid, video_description: description } = params
    // 发布视频
    const result = await this.videoService.releaseVideo(userid, description, video, this.ctx.db)
    // 发布系统通知
    const followListPromise = this.userSevice.getFollowed(userid, this.ctx.db)
    const userInfoPromise = getUser(userid, this.ctx.db)
    const [followList, userInfo] = await Promise.all([followListPromise, userInfoPromise])
    if (followList.length) {
      await this.messageService.createMessage(userid, '短视频发布', `您关注的${userInfo.user_name}发布了短视频，快来看呀。`, followList, this.ctx.db);
    }
    this.ctx.body = result
  }
  @Get('/comment')
  async comment(@Params(['query']) params) {
    const { release_id: releaseid, video_id: videoid, user_id: userid, comment_content: commentContent } = params
    const result = await this.commentService.comment(releaseid, videoid, userid, commentContent, 0, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/comment-list')
  async getCommentList(@Params(['query']) params) {
    const { video_id: videoid, page, count } = params
    const result = await this.commentService.getCommentList(videoid, 0, page, count, this.ctx.db);
    this.ctx.body = result;
  }
  @Get('/share')
  async share(@Params(['query']) params) {
    const { video_id: videoid } = params
    const result = await this.videoService.share(videoid, this.ctx.db)
    this.ctx.body = result
  }
}