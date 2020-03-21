import { Injectable } from 'kever'
import { baseUrlToOOS } from '../utils'
import { QuestionInterface } from '../interface'

@Injectable('question')
export default class QuestionService implements QuestionInterface {
  async getQuestionList(stageNum: any, db: any): Promise<any> {
    try {
      let selectSentence;
      if (stageNum) {
        selectSentence = 'select * from question where stage_num = ?'
      } else {
        selectSentence = 'select * from question'
      }
      const [rows] = await db.query(selectSentence, [stageNum])
      return rows
    } catch (err) {
      return false
    }
  }
  async createQuestion(questionInfo: any, db: any): Promise<any> {
    try {
      const bannerImage = await baseUrlToOOS('stage', questionInfo.questionImage)
      const createTime = Date.now();
      const insertSentence = 'insert into question(stage_num,quetion_title,question_image,question_option,question_correct,create_time) values(?,?,?,?,?,?)'
      const [rows] = await db.query(insertSentence, [
        questionInfo.stageNum,
        questionInfo.questionTitle,
        bannerImage,
        questionInfo.questionOption,
        questionInfo.questionCorrect,
        createTime
      ])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async updateQuestionInfo(questionId: number, questionInfo: any, db: any): Promise<any> {
    try {
      const createTime = Date.now()
      let bannerUrl
      if (questionInfo.bannerUrl.split(':')[0] === 'http') {
        bannerUrl = questionInfo.questionImage
      } else {
        bannerUrl = await baseUrlToOOS('advisory', questionInfo.questionImage)
      }
      const updateSentence = ` update question set
      stage_num=?,
      quetion_title=?,
      question_image=?,
      question_option=?,
      question_correct=?,
      create_time=? where question_id = ?
      `
      const [rows] = await db.query(updateSentence, [
        questionInfo.stageNum,
        questionInfo.questionTitle,
        bannerUrl,
        questionInfo.questionOption,
        questionInfo.questionCorrect,
        createTime,
        questionId,
      ])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async deleteQuestion(questionId: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from question where question_id = ?'
      const [rows] = await db.query(deleteSentence, [questionId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
}