import { Injectable } from 'kever';
import { FeedbackInterface, ResultData } from '../interface';

@Injectable('feedback')
export default class FeedbackService implements FeedbackInterface {
  public data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async getFeedbackList(db: any): Promise<ResultData> {
    try {
      const selectSentence = 'select * from feedback';
      let [rows, fields] = await db.query(selectSentence);
      rows.sort((a, b) => a.create_time - b.create_time)
      return Object.assign({}, this.data, {
        message: '获取意见反馈列表成功',
        data: rows
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取意见反馈列表失败'
      })
    }
  }
  async releaseFeedback(userid: number, feedbackContent: string, db: any): Promise<ResultData> {
    try {
      const insertSentence = 'insert into feedback(user_id,feedback_content,create_time) values(?,?,?)'
      const createTime = Date.now()
      const [rows, fileds] = await db.query(insertSentence, [userid, feedbackContent, createTime])
      if (rows.affectedRows == 1) {
        return Object.assign({}, this.data, {
          message: '发布成功'
        })
      } else {
        throw new Error()
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '发布失败'
      })
    }
  }
  async deleteFeedback(feedbackid: number, db: any): Promise<ResultData> {
    try {
      const deleteSentence = 'delete from feedback where feedback_id = ?'
      const [rows, fileds] = await db.query(deleteSentence, [feedbackid])
      if (rows.affectedRows == 1) {
        return Object.assign({}, this.data, {
          message: '删除成功'
        })
      } else {
        throw new Error()
      }

    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '删除失败'
      })
    }
  }
  async updateStatus(feedbackid: number, feedbackStatus: number, db: any): Promise<ResultData> {
    try {
      const updateSentence = 'update feedback set feedback_status = ? where feedback_id = ?'
      const [rows, fileds] = await db.query(updateSentence, [feedbackStatus, feedbackid])
      const userid = await this.getFeedback(feedbackid, db);
      if (rows.affectedRows == 1) {
        return Object.assign({}, this.data, {
          message: '更新成功',
          data: userid
        })
      } else {
        throw new Error()
      }

    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '更新失败'
      })
    }
  }
  async getFeedback(feedbackid: number, db: any): Promise<any> {
    const selectSentence = 'select user_id from feedback where feedback_id = ?'
    const [rows, fileds] = await db.query(selectSentence, [feedbackid])
    return rows[0].user_id
  }
}