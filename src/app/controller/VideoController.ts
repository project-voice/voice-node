import { Controller, BaseController, Inject, Get, Post, Params } from 'kever'
import { createResultData, beforeTime } from '../utils'

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
      const followList = await this.followService.getFollowList(userId, this.ctx.db)
      const followsUserId = followList.map(user => user.followuser_id)
      const followVideosPromise = this.videoService.getVideoListFollow(followsUserId, this.ctx.db)
      const recommendVideosPromise = this.videoService.getVideoListRecommend(this.ctx.db)
      let [followVideos, recommendVideo] = await Promise.all([followVideosPromise, recommendVideosPromise])
      const follow = []
      const recommend = []
      for (let video of followVideos) {
        const userInfoPromise = this.userService.findUser('user_id', video.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(0, video.video_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(0, userId, video.video_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(video.create_time)
        follow.push(Object.assign(video, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support,
          follow: true
        }))
      }
      for (let video of recommendVideo) {
        const userInfoPromise = this.userService.findUser('user_id', video.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(0, video.video_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(0, userId, video.video_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(video.create_time)
        recommend.push(Object.assign(video, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support,
          follow: followsUserId.includes(video.user_id)
        }))
      }
      resultData = createResultData({
        message: '请求成功',
        data: {
          follow: follow,
          recommend: recommend
        }
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
      let processResult = []
      for (let video of result) {
        const userInfoPromise = this.userService.findUser('user_id', video.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(0, video.video_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(0, 0, video.video_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(video.create_time)
        processResult.push(Object.assign(video, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support,
        }))
      }
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
      let processResult = []
      for (let video of result) {
        const userInfoPromise = this.userService.findUser('user_id', video.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(0, video.video_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(0, userId, video.video_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(video.create_time)
        processResult.push(Object.assign(video, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support,
        }))
      }
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