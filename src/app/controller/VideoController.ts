import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'
import { createResultData } from '../utils'

@Controller('/video')
export default class VideoController extends BaseController {
  @Inject('video')
  public videoService
  @Inject('user')
  public userService
  @Inject('follow')
  public followService
  @Inject('support')
  public supportService
  @Inject('comment')
  public commentService

  @Get('/get-video-all')
  async getVideoListAll(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId } = params
      const followList = this.followService.getFollowList(userId, this.ctx.body)
      const followsUserId = followList.map(user => user.user_id)
      const followVideosPromise = this.videoService.getVideoListFollow(followsUserId, this.ctx.db)
      const recommendVideosPromise = this.videoService.getVideoListRecommend(this.ctx.db)
      let [followVideos, recommendVideo] = await Promise.all([followVideosPromise, recommendVideosPromise])
      followVideos = followVideos.map(video => {
        return Object.assign(video, {
          follow: true
        })
      })
      recommendVideo = recommendVideo.map(video => {
        return Object.assign(video, {
          follow: followsUserId.includes(video.user_id)
        })
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/video-list')
  async getVieoList() {
    let resultData
    try {
      const result = await this.videoService.getVideoListRecommend(this.ctx.db)
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
  @Get('/video-list-self')
  async getVideoListToSelf(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId } = params
      const result = await this.videoService.videoToSelf(userId, this.ctx.db)
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
  @Get('/delete')
  async deleteVideo(@Params(['query']) params) {
    let resultData
    try {
      const { video_id: videoId } = params
      const result = await this.videoService.deleteVideo(videoId, this.ctx.db)
      if (!result) {
        throw new Error('删除失败')
      }
      resultData = createResultData({
        message: '删除成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/disable')
  async disableVideo(@Params(['query']) params) {
    let resultData
    try {
      const { video_id: videoId } = params
      const result = await this.videoService.disableVideo(videoId, this.ctx.db)
      if (!result) {
        throw new Error('请求失败')
      }
      resultData = createResultData({
        message: '请求成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }

  @Get('/support')
  async support(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId, video_id: videoId } = params
      const result = await this.supportService.support(userId, videoId, 0, this.ctx.db)
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
  @Post('/release-video')
  async releaseVideo(@Params(['body']) params) {
    let resultData
    try {
      const request = this.ctx.request as any;
      const video = request.files['video']
      const image = request.files['image']
      const { user_id: userid, video_description: description } = params
      // 发布视频
      const result = await this.videoService.releaseVideo(userid, description, video, image, this.ctx)
      if (!result) {
        throw new Error('发布失败')
      }
      resultData = createResultData({
        message: '发布成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }

    this.ctx.body = resultData
  }
  @Get('/comment')
  async comment(@Params(['query']) params) {
    let resultData
    try {
      const { video_id: videoid, user_id: userid, comment_content: commentContent } = params
      const result = await this.commentService.comment(videoid, userid, commentContent, 0, this.ctx.db)
      if (!result) {
        throw new Error('评论失败')
      }
      createResultData({
        message: '评论成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }

    this.ctx.body = resultData
  }
  @Get('/comment-list')
  async getCommentList(@Params(['query']) params) {
    let resultData
    try {
      const { video_id: videoid, page, count } = params
      const result = await this.commentService.getCommentList(videoid, 0, page, count, this.ctx.db);
      const processComment = result.map(async (comment) => {
        const userInfo = await this.userService.findUser('user_id', comment.user_id, this.ctx.db)
        return Object.assign(comment, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image
        })
      })
      resultData = createResultData({
        message: '请求成功',
        data: processComment,
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData;
  }
  @Get('/share')
  async share(@Params(['query']) params) {
    let resultData
    try {
      const { video_id: videoid } = params
      const result = await this.videoService.share(videoid, this.ctx.db)
      if (!result) {
        throw new Error('请求失败')
      }
      resultData = createResultData({
        message: '请求成功'
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