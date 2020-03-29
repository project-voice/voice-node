import { Controller, BaseController, Inject, Get, Params, Post } from 'kever'
import { createResultData } from '../utils'

@Controller('/question')
export default class QuestionController extends BaseController {
  @Inject('question')
  public questionService
  @Inject('answer')
  public answerService
  @Inject('stage')
  public stageService
  @Get('/question-list-all')
  async getQuestionListAll() {
    let resultData
    try {
      const result = await this.questionService.getQuestionList(undefined, this.ctx.db)
      if (!result) {
        throw new Error('获取失败')
      }
      resultData = createResultData({
        message: '获取成功',
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
  @Get('/question-list')
  async getQuestionListByStage(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId, stage_num: stageNum } = params
      const questionList = await this.questionService.getQuestionList(stageNum, this.ctx.db)
      const answerList = await this.answerService.getAnswerListByUser(userId, this.ctx.db)
      const answerQuestionsId = answerList.map(answer => answer.question_id)
      const processQuestionList = questionList.filter(question => !answerQuestionsId.includes(question.question_id))
      resultData = createResultData({
        message: '获取成功',
        data: processQuestionList
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Post('/release-question')
  async releaseQuestion(@Params(['body']) params) {
    let resultData
    try {
      const { stage_num: stageNum, question_title: questionTitle, question_image: questionImage, question_option: questionOption, question_correct: questionCorrect } = params
      const isStaged = await this.stageService.checkStage(stageNum, this.ctx.db)
      if (!isStaged) {
        throw new Error('该学习阶段不存在')
      }
      const result = await this.questionService.createQuestion({
        stageNum,
        questionTitle,
        questionImage,
        questionOption,
        questionCorrect
      }, this.ctx.db)
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
  @Post('/update-question')
  async updateQuestion(@Params(['body']) params) {
    let resultData
    try {
      const { question_id: questionId, stage_num: stageNum, question_title: questionTitle, question_image: questionImage, question_option: questionOption, question_correct: questionCorrect } = params
      const isStaged = await this.stageService.checkStage(stageNum, this.ctx.db)
      if (!isStaged) {
        throw new Error('该学习阶段不存在')
      }
      const result = await this.questionService.updateQuestionInfo(
        questionId,
        {
          stageNum,
          questionTitle,
          questionImage,
          questionOption,
          questionCorrect
        }, this.ctx.db)
      if (!result) {
        throw new Error('更新失败')
      }
      resultData = createResultData({
        message: '更新成功'
      })
    } catch (err) {
      console.log(err)
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Get('/delete-question')
  async deleteQuestion(@Params(['query']) params) {
    let resultData
    try {
      const { question_id: questionId } = params
      const result = await this.questionService.deleteQuestion(questionId, this.ctx.db)
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
}