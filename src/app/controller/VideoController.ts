import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'

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

  @Get('/get-video-all')
  async getVideoListAll(@Params(['query']) params) {
    try {
      const { user_id: userid, count } = params
      let followList = await this.userSevice.getFollowList(userid, this.ctx.db)
      followList = followList.map(user => user.user_id)
      const followPromise = this.videoService.getVideoListFollow(userid, followList, count, 1, this.ctx.db)
      const recommendPromise = this.videoService.getVideoListRecommend(userid, count, 1, this.ctx.db)
      const [follow, recommend] = await Promise.all([followPromise, recommendPromise])
      return Object.assign({}, this.videoService.data, {
        message: '获取视频列表成功',
        data: {
          follow,
          recommend
        }
      })
    } catch (err) {
      return Object.assign({}, this.videoService.data, {
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
      if (type === 'follow') {
        let followList = await this.userSevice.getFollowList(userid, this.ctx.db)
        followList = followList.map(user => user.user_id)
        result = await this.videoService.getVideoListFollow(userid, followList, count, page, this.ctx.db)
      } else {
        result = await this.videoService.getVideoListRecommend(userid, count, page, this.ctx.db)
      }
      return Object.assign({}, this.videoService.data, {
        message: '获取视频列表成功',
        data: result
      })
    } catch (err) {
      return Object.assign({}, this.videoService.data, {
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
    const result = this.videoService.releaseVideo(userid, description, video, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/comment')
  async comment(@Params(['query']) params) {
    const { release_id: releaseid, topic_id: topicid, user_id: userid, comment_content: commentContent } = params
    const result = await this.commentService.comment(releaseid, topicid, userid, commentContent, 0, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/comment-list')
  async getCommentList(@Params(['query']) params) {
    const { topic_id: topicid, page, count } = params
    const result = await this.commentService.getCommentList(topicid, 0, page, count, this.ctx.db);
    this.ctx.body = result;
  }
}