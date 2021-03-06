import { Controller, BaseController, Inject, Get, Params, Post, Req } from 'kever'
import { createResultData, beforeTime } from '../utils'

@Controller('/topic')
export default class TopicController extends BaseController {
  @Inject('topic')
  private topicService
  @Inject('support')
  private supportService
  @Inject('comment')
  public commentService
  @Inject('user')
  public userService

  @Get('/get-topic-all-first')
  async getTopicAllToFirst(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId, count } = params
      const result = await this.topicService.getTopicAllToFirst(count, this.ctx.db)
      const topicContent = []
      for (let topics of result.topic_content) {
        const processTopics = []
        for (let topic of topics) {
          // 获取用户信息、点赞数、评论数
          const userInfoPromise = this.userService.findUser('user_id', topic.user_id, this.ctx.db)
          const commentCountPromise = this.commentService.getCommentCount(1, topic.topic_id, this.ctx.db)
          const supportPromise = this.supportService.getSupport(1, userId, topic.topic_id, this.ctx.db)
          const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
          const createTime = beforeTime(topic.create_time)
          processTopics.push(Object.assign(topic, {
            user_name: userInfo.user_name,
            user_image: userInfo.user_image,
            create_time: createTime,
            comment: commentCount,
            support
          }))
        }
        topicContent.push(processTopics)
      }
      resultData = createResultData({
        message: '获取成功',
        data: {
          topic_title: result.topic_title,
          topic_content: topicContent
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
  @Get('/get-topic')
  async getTopic(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId, topic_type: typeType, page, count } = params;
      const result = await this.topicService.getTopic(typeType, page, count, this.ctx.db)
      const processTopics = []
      for (let topic of result) {
        const userInfoPromise = this.userService.findUser('user_id', topic.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(1, topic.topic_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(1, userId, topic.topic_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(topic.create_time)
        processTopics.push(Object.assign(topic, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support
        }))
      }
      resultData = createResultData({
        message: '获取成功',
        data: processTopics
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/topic-list')
  async getTopicList(@Params(['query']) params) {
    let resultData
    try {
      const { page, count } = params
      const result = await this.topicService.getTopicAll(page, count, this.ctx.db)
      let processTopics = []
      for (let topic of result) {
        const userInfoPromise = this.userService.findUser('user_id', topic.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(1, topic.topic_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(1, 0, topic.topic_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(topic.create_time)
        processTopics.push(Object.assign(topic, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support
        }))
      }
      resultData = createResultData({
        message: '获取成功',
        data: processTopics
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/topic-self-list')
  async getTopicListToSelf(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId } = params
      const result = await this.topicService.getTopicListToSelf(userId, this.ctx.db)
      let processTopics = []
      for (let topic of result) {
        const userInfoPromise = this.userService.findUser('user_id', topic.user_id, this.ctx.db)
        const commentCountPromise = this.commentService.getCommentCount(1, topic.topic_id, this.ctx.db)
        const supportPromise = this.supportService.getSupport(1, userId, topic.topic_id, this.ctx.db)
        const [userInfo, commentCount, support] = await Promise.all([userInfoPromise, commentCountPromise, supportPromise])
        const createTime = beforeTime(topic.create_time)
        processTopics.push(Object.assign(topic, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          create_time: createTime,
          comment: commentCount,
          support
        }))
      }
      resultData = createResultData({
        message: '获取成功',
        data: processTopics
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
  async deleteTopic(@Params(['query']) params) {
    let resultData
    try {
      const { topic_id: topicId } = params
      const topicResult = await this.topicService.deleteTopic(topicId, this.ctx.db)
      // 删除话题对应的评论
      const commentResult = await this.commentService.deleteComment(1, topicId, this.ctx.db)
      // 删除话题对应的点赞
      const supportResult = await this.supportService.deleteSupport(1, topicId, this.ctx.db)
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
  async disableTopic(@Params(['query']) params) {
    let resultData
    try {
      const { topic_id: topicId } = params
      const result = this.topicService.disableTopic(topicId, this.ctx.db)
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
  @Post('/release-topic')
  async releaseTopic(@Params(['body']) params) {
    let resultData
    try {
      const request = this.ctx.request as any;
      let images = request.files['images[]'];
      if (images === undefined) {
        images = []
      } else if (!Array.isArray(images)) {
        images = [images];
      }
      const { user_id: userid, topic_type: topicType, content } = params
      const result = await this.topicService.releaseTopic(userid, topicType, content, images, this.ctx.db)
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
}