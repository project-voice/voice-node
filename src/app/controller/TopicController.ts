import { Controller, BaseController, Inject, Get, Params, Post, Req } from 'kever'
import { getUser } from '../service/common'

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
  @Inject('message')
  public messageService

  @Get('/get-topic-all')
  async getTopicAll(@Params(['query']) params) {
    const { user_id: userid, page, count } = params
    const result = await this.topicService.getTopicAll(userid, page, count, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/get-topic')
  async getTopic(@Params(['query']) params) {
    const { user_id: userid, topic_type: typeType, page, count } = params;
    const result = await this.topicService.getTopic(userid, typeType, page, count, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/support')
  async support(@Params(['query']) params) {
    const { topic_id: topicid, user_id: userid } = params
    const result = await this.supportService.support(userid, topicid, 1, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/comment')
  async comment(@Params(['query']) params) {
    const { release_id: releaseid, topic_id: topicid, user_id: userid, comment_content: commentContent } = params
    const result = await this.commentService.comment(releaseid, topicid, userid, commentContent, 1, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/comment-list')
  async getCommentList(@Params(['query']) params) {
    const { topic_id: topicid, page, count } = params
    const result = await this.commentService.getCommentList(topicid, 1, page, count, this.ctx.db);
    this.ctx.body = result;
  }
  @Post('/release-topic')
  async releaseTopic(@Params(['body']) params) {
    const request = this.ctx.request as any;
    let images = request.files['images[]'];
    if (!Array.isArray(images)) {
      images = [images];
    }
    const { user_id: userid, topic_type: topicType, content } = params
    const result = await this.topicService.releaseTopic(userid, topicType, content, images, this.ctx.db)
    // 系统消息通知
    const followListPromise = this.userService.getFollowed(userid, this.ctx.db)
    const userInfoPromise = getUser(userid, this.ctx.db)
    const [followList, userInfo] = await Promise.all([followListPromise, userInfoPromise])
    if (followList.length) {
      await this.messageService.createMessage(userid, '英语角发布', `您关注的${userInfo.user_name}发布了英语角话题,快来评论呀。`, followList, this.ctx.db);
    }
    this.ctx.body = result
  }
}