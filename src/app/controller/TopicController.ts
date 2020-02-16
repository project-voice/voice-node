import { Controller, BaseController, Inject, Get, Params, Post, Req } from 'kever'

@Controller('/topic')
export default class TopicController extends BaseController {
  @Inject('topic')
  private topicService

  @Get('/get-topic-all')
  async getTopicAll(@Params(['query']) params) {
    try {
      const { page, count } = params
      const result = await this.topicService.getTopicAll(page, count, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Get('/get-topic')
  async getTopic(@Params(['query']) params) {
    try {
      const { type_id: typeid, page, count } = params;
      const result = await this.topicService.getTopic(typeid, page, count, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Get('/support')
  async support(@Params(['query']) params) {
    try {
      const { type_id: typeid, topic_id: topicid, user_id: userid } = params
      const result = await this.topicService.support(typeid, topicid, userid, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Get('/comment')
  async comment(@Params(['query']) params) {
    try {
      const { type_id: typeid, topic_id: topicid, user_id: userid, comment_content: commentContent } = params
      const result = await this.topicService.comment(typeid, topicid, userid, commentContent, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      this.ctx.body = { noerr: 1 }
    }
  }
  @Post('/release-topic')
  async releaseTopic(@Params(['body']) params) {
    try {
      const request = this.ctx.request as any;
      const { images } = request.files;
      console.log('images', images)
      const { user_id: userid, topic_type: topicType, content } = params
      const result = await this.topicService.releaseTopic(userid, topicType, content, images, this.ctx.db)
      this.ctx.body = result
    } catch (err) {
      console.log(err)
      this.ctx.body = { noerr: 1 }
    }
  }
}