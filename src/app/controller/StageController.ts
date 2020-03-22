import { Controller, BaseController, Inject, Get, Params, Post } from 'kever'
import { createResultData } from '../utils'

@Controller('/stage')
export default class StageController extends BaseController {
  @Inject('stage')
  public stageService
  @Inject('question')
  public questionService
  @Inject('answer')
  public answerService

  @Get('/stage-list')
  async getStateList(@Params(['query']) params) {
    let resultData
    try {
      const { user_id: userId } = params
      let stageList = await this.stageService.getStageList(this.ctx.db)
      stageList.sort((a, b) => a.stage_num - b.stage_num)
      let beforeStageComplete = false
      const processStageList = []
      for (let i = 0, len = stageList.length; i < len; i++) {
        let lock = true
        const stageNum = stageList[i].stage_num
        const questionList = await this.questionService.getQuestionList(stageNum, this.ctx.db)
        const answerList = await this.answerService.getAnswerList(stageNum, this.ctx.db)
        const stageAnswerList = answerList.filter(answer => answer.user_id == userId)
        const answerUsersId = answerList.map(answer => answer.user_id)
        const userCount = [...new Set(answerUsersId)].length
        const questionLen = questionList.length
        const answerLen = stageAnswerList.length
        let complete: number;
        if (questionLen === 0) {
          complete = 1.00
        } else {
          complete = Number((answerLen / questionLen).toFixed(2))
        }
        if (i === 0) {
          lock = false
        } else if (beforeStageComplete) {
          lock = false
        }
        beforeStageComplete = (questionLen === answerLen && questionLen !== 0)
        processStageList.push(Object.assign(stageList[i], {
          lock,
          complete,
          userCount
        }))
      }
      resultData = createResultData({
        message: '获取成功',
        data: processStageList
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData
  }
  @Post('/release-stage')
  async releaseStage(@Params(['body']) params) {
    let resultData
    try {
      const { stage_num: stageNum, stage_title: stageTitle, stage_image: stageImage, stage_description: stageDescription, stage_tag: stageTag } = params
      const isStaged = await this.stageService.checkStage(stageNum, this.ctx.db)
      if (isStaged) {
        throw new Error('该学习阶段已存在')
      }
      const result = await this.stageService.createStage({
        stageNum,
        stageTitle,
        stageImage,
        stageDescription,
        stageTag
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
  @Post('/update-stage')
  async updateStageInfo(@Params(['body']) params) {
    let resultData
    try {
      const { stage_id: stageId, stage_num: stageNum, stage_title: stageTitle, stage_image: stageImage, stage_description: stageDescription, stage_tag: stageTag } = params
      const isStaged = await this.stageService.checkStage(stageNum, this.ctx.db)
      if (isStaged) {
        throw new Error('该学习阶段已存在')
      }
      const result = await this.stageService.updateStage(stageId, {
        stageNum,
        stageTitle,
        stageImage,
        stageDescription,
        stageTag
      }, this.ctx.db)
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
  @Get('/delete-stage')
  async deleteStage(@Params(['query']) params) {
    let resultData
    try {
      const { stage_id: stageId } = params
      const result = await this.stageService.deleteStage(stageId, this.ctx.db)
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