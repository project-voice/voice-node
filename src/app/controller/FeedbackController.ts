import { Controller, BaseController, Inject, Get, Params, Post } from 'kever';
import { getUser } from '../service/common';

@Controller('/feedback')
export default class FeedbackController extends BaseController {
  @Inject('feedback')
  public feedbackService;
  @Inject('message')
  public messageService;

  @Get('/get-feedback-list')
  async getFeedbackList() {
    const result = await this.feedbackService.getFeedbackList(this.ctx.db)
    this.ctx.body = result
  }
  @Post('/release-feedback')
  async releaseFeedback(@Params(['body']) params) {
    const { user_id: userid, feedback_content: feedbackContent } = params
    const result = await this.feedbackService.releaseFeedback(userid, feedbackContent, this.ctx.db)
    this.ctx.body = result
  }
  @Get('/delete-feedback')
  async deleteFeedback(@Params(['query']) params) {
    const { feedback_id: feedbackid } = params
    const result = await this.feedbackService.deleteFeedback(feedbackid, this.ctx.db)
    this.ctx.body = result;
  }
  @Get('/update-status')
  async updateStatus(@Params(['query']) params) {
    const { feedback_id: feedbackid, feedback_status: feedbackStatus } = params;
    const result = await this.feedbackService.updateStatus(feedbackid, feedbackStatus, this.ctx.db)
    // 系统消息通知
    const userInfo = await getUser(result.data, this.ctx.db)
    await this.messageService.createMessage(userInfo.user_id, '意见反馈', `您发布的意见反馈已得到解决，快来体验吧。`, [userInfo.user_id], this.ctx.db);
    this.ctx.body = result
  }
}