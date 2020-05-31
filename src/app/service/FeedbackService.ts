import { Injectable } from 'kever';
import { FeedbackInterface } from '../interface';

@Injectable('feedback')
export default class FeedbackService implements FeedbackInterface {

  async getFeedbackList(db: any): Promise<any> {
    try {
      const selectSentence = 'select * from feedback order by create_time desc';
      const [rows] = await db.query(selectSentence);
      return rows
    } catch (err) {
      return false
    }
  }
  async releaseFeedback(userid: number, feedbackContent: string, db: any): Promise<any> {
    try {
      const insertSentence = 'insert into feedback(user_id,feedback_content,create_time) values(?,?,?)'
      const createTime = Date.now()
      const [rows] = await db.query(insertSentence, [userid, feedbackContent, createTime])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async deleteFeedback(feedbackid: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from feedback where feedback_id = ?'
      const [rows] = await db.query(deleteSentence, [feedbackid])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async updateStatus(feedbackid: number, feedbackStatus: number, db: any): Promise<any> {
    try {
      const updateSentence = 'update feedback set feedback_status = ? where feedback_id = ?'
      const [rows] = await db.query(updateSentence, [feedbackStatus, feedbackid])
      const userId = await this.getFeedback(feedbackid, db);
      if (rows.affectedRows > 0) {
        return userId
      }
      return false
    } catch (err) {
      return false
    }
  }
  async getFeedback(feedbackid: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select user_id from feedback where feedback_id = ?'
      const [rows, fileds] = await db.query(selectSentence, [feedbackid])
      return rows[0].user_id
    } catch (err) {
      0
    }
  }
}