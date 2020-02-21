import { Injectable } from 'kever'
import { CommentInterface, ResultData } from '../interface';
import { beforeTime } from '../utils'
import { getUser } from './common'

@Injectable('comment')
export default class CommentService implements CommentInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async comment(releaseid: number, topicid: number, userid: number, commentContent: string, commentType: number, db): Promise<ResultData> {
    try {
      const insertCommentSentence = `insert into comment(release_id,topic_id,user_id,comment_content,create_time,comment_type) values(?,?,?,?,?,?)`
      const createTime = Date.now();
      const [rows, fileds] = await db.query(insertCommentSentence, [releaseid, topicid, userid, commentContent, createTime, commentType])
      if (rows.affectedRows === 1) {
        return Object.assign({}, this.data, {
          message: '评论成功'
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '评论失败'
      })
    }
  }
  async getCommentList(topicid: number, commentType: number, page: number, count: number, db): Promise<ResultData> {
    try {
      const selectCommentSentence = `select * from comment where topic_id = ? and comment_type=?`
      let [rows, fileds] = await db.query(selectCommentSentence, [topicid, commentType])
      rows.sort((a, b) => b.create_time - a.create_time)
      const maxCount = rows.length;
      // 分页
      rows = rows.slice((page - 1) * count, page * count);
      for (let comment of rows) {
        const releaseid = comment.release_id
        const userid = comment.user_id
        let createTime = comment.create_time
        createTime = beforeTime(createTime)
        const releaseInfoPromise = getUser(releaseid, db)
        const userInfoPromise = getUser(userid, db)
        const [releaseInfo, userInfo] = await Promise.all([releaseInfoPromise, userInfoPromise])
        Object.assign(comment, {
          create_time: createTime,
          user_name: userInfo.user_name,
          user_image: userInfo.user_image,
          release_name: releaseInfo.user_name
        })
      }
      return Object.assign({}, this.data, {
        message: '获取评论列表成功',
        data: {
          count: maxCount,
          list: rows
        }
      })
    } catch (err) {
      console.log(err);
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取评论列表失败'
      })
    }
  }
  async deleteComment(commentid: number, db): Promise<ResultData> {
    try {
      const deleteSentence = `delete from comment where comment_id = ?`
      const [rows, fileds] = await db.query(deleteSentence, [commentid])
      if (rows.affectedRows === 1) {
        return Object.assign({}, this.data, {
          message: '删除成功'
        })
      } else {
        throw new Error()
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '删除失败',
        data: err,
      })
    }

  }
}