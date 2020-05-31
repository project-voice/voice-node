import { Controller, BaseController, Inject, Get, Params, Post } from 'kever'
import { createResultData } from '../utils'

@Controller('/answer')
export default class AnswerController extends BaseController {
  @Inject('answer')
  public answerService
  @Inject('user')
  public userService
  @Get('/index-rank-all')
  async getIndexRankAll() {
    let resultData
    const unit = 5;
    try {
      const answerList = await this.answerService.getAnswerList(undefined, this.ctx.db)
      const processAnswerList = answerList.reduce((result, item) => {
        if (result[item.user_id]) {
          result[item.user_id]['index'] += unit
          result[item.user_id]['num']++
        } else {
          result[item.user_id] = {}
          result[item.user_id]['index'] = unit
          result[item.user_id]['num'] = 1
        }
        return result
      }, {})
      const processAnswer = Object.keys(processAnswerList).map(key => {
        return Object.assign(processAnswerList[key], {
          user_id: key
        })
      })
      processAnswer.sort((a, b) => b.index - a.index)
      let ProcessAnswerResult = []
      for (let answer of processAnswer) {
        const userInfo = await this.userService.findUser('user_id', answer.user_id, this.ctx.db)
        ProcessAnswerResult.push(Object.assign(answer, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image
        }))
      }
      resultData = createResultData({
        message: '获取成功',
        data: ProcessAnswerResult,
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Post('/answer')
  async asnwerAction(@Params(['body']) params) {
    let resultData
    try {
      const { user_id: userId, question_id: quesionId, stage_num: stageNum } = params
      const result = await this.answerService.createAnswer(userId, quesionId, stageNum, this.ctx.db)
      if (!result) {
        throw new Error('答题失败')
      }
      resultData = createResultData({
        message: '答题成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Post('/rank-index-self')
  async getRankIndexToSelf(@Params(['query']) params) {
    let resultData;
    let unit = 5;
    try {
      const { user_id: userId } = params
      const result = await this.answerService.getAnswerListByUser(userId, this.ctx.db)
      if (!result) {
        throw new Error('获取失败')
      }
      resultData = createResultData({
        message: '获取成功',
        data: result.length * unit
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