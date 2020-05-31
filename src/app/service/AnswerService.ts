import { Injectable } from 'kever'
import { AnswerInterface } from '../interface';

@Injectable('answer')
export default class AnswerService implements AnswerInterface {
  async getAnswerList(stageNum: number, db: any) {
    try {
      let selectSentence = 'select * from answer '
      if (stageNum) {
        selectSentence = 'select * from answer where stage_num = ?'
      }
      const [rows] = await db.query(selectSentence, [stageNum])
      return rows;
    } catch (err) {
      return false
    }
  }
  async createAnswer(userId: number, questionId: number, stageNum: number, db: any): Promise<any> {
    try {
      const insertSentence = 'insert into answer(user_id,question_id, stage_num) values(?,?,?)'
      const [rows] = await db.query(insertSentence, [userId, questionId, stageNum])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async getAnswerListByUser(userId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from answer where user_id = ?'
      const [rows] = await db.query(selectSentence, [userId])
      return rows
    } catch (err) {
      return false
    }
  }
}