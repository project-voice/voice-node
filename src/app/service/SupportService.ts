import { Injectable } from 'kever'
import { SupportInterface } from '../interface'

@Injectable('support')
export default class SupportService implements SupportInterface {
  async getSupport(supportType: number, userId: number, targetId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from support where support_type = ? and topic_id = ?'
      const checkPromise = this.checkUser(supportType, userId, targetId, db)
      const supportListPromise = db.query(selectSentence, [supportType, targetId])
      const [checked, supportList] = await Promise.all([checkPromise, supportListPromise])
      const supportCount = supportList[0].length
      return {
        count: supportCount,
        action: checked
      }
    } catch (err) {
      console.log(err)
      return false
    }
  }
  async support(userId: number, targetId: number, supportType: number, db: any): Promise<any> {
    try {
      const checked = await this.checkUser(supportType, userId, targetId, db)
      let sentence = ''
      if (checked) {
        sentence = 'delete from support where support_type = ? and user_id = ? and topic_id = ?'
      } else {
        sentence = 'insert into support(support_type,user_id,topic_id) values(?,?,?)'
      }
      const [rows] = await db.query(sentence, [supportType, userId, targetId])
      const supportInfo = await this.getSupport(supportType, userId, targetId, db)
      if (rows.affectedRows > 0) {
        return supportInfo
      }
      return false
    } catch (err) {
      return false
    }
  }
  async checkUser(supportType: number, userId: number, targetId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from support where support_type = ? and user_id = ? and topic_id = ?'
      const [rows] = await db.query(selectSentence, [supportType, userId, targetId])
      if (rows.length == 0) {
        return false
      }
      return true
    } catch (err) {
      return false
    }
  }
  async deleteSupport(supportType: number, targetId: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from support where support_type = ?  and topic_id = ?'
      const [rows] = await db.query(deleteSentence, [supportType, targetId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
}