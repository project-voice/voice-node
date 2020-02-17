import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'

@Controller('/video')
export default class VideoController extends BaseController {
  @Inject('video')
  public videoService

  @Get('/get-video-all')
  async getVideoListAll(@Params(['query']) params) {
    const { user_id: userid, count } = params
    const result = this.videoService.getVideoListAll(userid, count, this.ctx.body)
    this.ctx.body = result
  }
  @Get('/get-video')
  async getVideoList(@Params(['query']) params) {
    const { user_id: userid, count, page, type } = params
    const result = this.videoService.getVideoList(userid, count, page, type, this.ctx.body)
    this.ctx.body = result
  }
  @Get('/support')
  async support(@Params(['query']) params) {
    const { user_id: userid, video_id: videoid } = params
    const result = this.videoService.support(userid, videoid, this.ctx.db)
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
  @Post('/comment')
  async comment(@Params(['body']) params) {
    const { release_id: releaseid, user_id: userid, video_id: videoid, comment_content: commentContent } = params
    const result = this.videoService.comment(releaseid, userid, videoid, commentContent, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/comment-list')
  async getCommentList(@Params(['body']) params) {
    const { video_id: videoid, page, count } = params
    const result = this.videoService.getCommentList(videoid, page, count, this.ctx.db)
    this.ctx.body = result
  }
}