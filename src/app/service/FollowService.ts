import { Injectable } from 'kever'
import { followInterface } from '../interface';

@Injectable('follow')
export default class FollowService implements followInterface {
  async follow(userid: number, followid: number, db: any): Promise<any> {
    try {
      const insertFollowSentence = `insert into follow(user_id,followuser_id) values(?,?)`
      const [rows] = await db.query(insertFollowSentence, [userid, followid])
      if (rows.affectedRows > 1) {
        return true
      }
    } catch (err) {
      return false;
    }
  }
  async getFollowList(userid: number, db: any): Promise<any> {
    try {
      const selectFollowSentence = `select followuser_id from follow where user_id = ?`
      const [rows, fields] = await db.query(selectFollowSentence, [userid])
      return rows
    } catch (err) {
      return false
    }
  }
  async cancelFollow(userid: number, followid: number, db: any): Promise<any> {
    try {
      const deleteSentence = `delete from follow where user_id=? and followuser_id=?`
      const [rows, fileds] = await db.query(deleteSentence, [userid, followid])
      if (rows.affectedRows > 1) {
        return true
      }
    } catch (err) {
      return false
    }
  }
  async getFollowed(userid: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select user_id from follow where followuser_id = ?'
      const [rows, fileds] = await db.query(selectSentence, [userid])
      const result = rows.map(item => item.user_id)
      return result
    } catch (err) {
      return []
    }
  }
}