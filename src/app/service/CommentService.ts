import { Injectable } from 'kever'
import { CommentInterface } from '../interface';
import { beforeTime } from '../utils'

@Injectable('comment')
export default class CommentService implements CommentInterface {
  async comment(topicid: number, userid: number, commentContent: string, commentType: number, db): Promise<any> {
    try {
      const insertCommentSentence = `insert into comment(topic_id,user_id,comment_content,create_time,comment_type) values(?,?,?,?,?)`
      const createTime = Date.now();
      const [rows] = await db.query(insertCommentSentence, [topicid, userid, commentContent, createTime, commentType])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async getCommentList(topicid: number, commentType: number, page: number, count: number, db): Promise<any> {
    try {
      const selectCommentSentence = `select * from comment where topic_id = ? and comment_type= ? limit ${(page - 1) * count}, ${count} order by create_time desc`
      let [rows] = await db.query(selectCommentSentence, [topicid, commentType])
      for (let comment of rows) {
        let createTime = comment.create_time
        createTime = beforeTime(createTime)
        Object.assign(comment, {
          create_time: createTime,
        })
      }
      return rows;
    } catch (err) {
      console.log(err);
      return false
    }
  }
  async deleteComment(commentType: number, targetId: number, db): Promise<any> {
    try {
      const deleteSentence = `delete from comment where comment_type = ? and topic_id = ?`
      const [rows] = await db.query(deleteSentence, [commentType, targetId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return true
    }
  }
  async getCommentCount(commentType: number, targetId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from comment where comment_type = ? and topic_id = ?'
      const [rows] = await db.query(selectSentence, [commentType, targetId])
      return rows.length
    } catch (err) {
      return false
    }
  }
}