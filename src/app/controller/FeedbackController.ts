import { Controller, BaseController, Inject, Get, Params, Post } from 'kever';
import { createResultData, beforeTime } from '../utils';

@Controller('/feedback')
export default class FeedbackController extends BaseController {
  @Inject('feedback')
  public feedbackService;
  @Inject('user')
  public userService

  @Get('/get-feedback-list')
  async getFeedbackList(@Params(['query']) params) {
    let resultData
    try {
      const {page, count } = params
      let result = await this.feedbackService.getFeedbackList(this.ctx.db)
      if (!result) {
        throw new Error('获取失败')
      }
      result = result.slice((page - 1)* count, page * count)
      const processFeedbackList = [];
      for(let feedback of result) {
        const userId = feedback.user_id;
        const userInfo = await this.userService.findUser('user_id',userId,this.ctx.db)
        const createTime = beforeTime(feedback.create_time)
        processFeedbackList.push(Object.assign(feedback, {
          user_name: userInfo.user_name,
          create_time: createTime
        }))

      }
      resultData = createResultData({
        message: '获取成功',
        data: processFeedbackList
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Post('/release-feedback')
  async releaseFeedback(@Params(['body']) params) {
    let resultData
    try {
      const { user_id: userid, feedback_content: feedbackContent } = params
      const result = await this.feedbackService.releaseFeedback(userid, feedbackContent, this.ctx.db)
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
  @Get('/delete-feedback')
  async deleteFeedback(@Params(['query']) params) {
    let resultData
    try {
      const { feedback_id: feedbackid } = params
      const result = await this.feedbackService.deleteFeedback(feedbackid, this.ctx.db)
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
    this.ctx.body = resultData;
  }
  @Get('/update-status')
  async updateStatus(@Params(['query']) params) {
    let resultData
    try {
      const { feedback_id: feedbackid, feedback_status: feedbackStatus } = params;
      const result = await this.feedbackService.updateStatus(feedbackid, feedbackStatus, this.ctx.db)
      if (!result) {
        throw new Error('更新失败')
      }
      resultData = createResultData({
        message: '更新成功'
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