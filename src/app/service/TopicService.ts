import { Injectable } from 'kever'
import { TopicInterface, ResultData } from '../interface';
import { uploadOss, beforeTime } from '../utils'

@Injectable('topic')
export default class TopicService implements TopicInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async getTopicAll(actionUserid: number, page: number, count: number, db): Promise<ResultData> {
    try {
      const selectVoiceSentence = `select * from topic`
      const [rows, fileds] = await db.query(selectVoiceSentence);
      const allTopic = [];
      // 按时间排序
      rows.sort((a, b) => b.create_time - a.create_time);
      const result = rows.reduce((result, row) => {
        if (allTopic.length < count) {
          allTopic.push(row);
        }
        const topic = result.find(item => item[0].topic_type === row.topic_type)
        if (topic) {
          if (topic.length < count) {
            topic.push(row)
          }
        } else {
          result.push([row])
        }
        return result;
      }, [])
      result.unshift(allTopic);
      // 用户池，避免多余的请求
      const userPoll = {}
      for (let i = 0; i < result.length; i++) {
        let topic = result[i];
        for (let j = 0; j < topic.length; j++) {
          const userid = topic[j].user_id
          const topicid = topic[j].topic_id
          let userinfo;
          let commentLen;
          let support;
          if (userPoll[userid]) {
            userinfo = userPoll[userid];
            const supportPromise = this.getSupport(topicid, actionUserid, db);
            const commentLenPromise = this.getCommentLen(topicid, db);
            const [su, len] = await Promise.all([supportPromise, commentLenPromise])
            support = su;
            commentLen = len
          } else {
            const userPromise = this.getUser(userid, db);
            const commentLenPromise = this.getCommentLen(topicid, db)
            const supportPromise = this.getSupport(topicid, actionUserid, db);
            const [user, len, su] = await Promise.all([userPromise, commentLenPromise, supportPromise])
            commentLen = len;
            support = su
            userPoll[userid] = user
            userinfo = user;
          }

          const createTime = beforeTime(topic[j].create_time)
          Object.assign(topic[j], {
            user_name: userinfo.user_name,
            user_image: userinfo.user_image,
            create_time: createTime,
            comment: commentLen,
            support: support,
          })
        }
      }
      let topic_title = ['全部']
      result.forEach((topic, idx) => {
        const type = topic[0].topic_type;
        if (!topic_title[idx]) {
          topic_title[idx] = type;
        }
      });

      return Object.assign({}, this.data, {
        message: '数据请求成功',
        data: {
          topic_title,
          topic_content: result
        }
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '数据请求失败',
      })
    }
  }
  async getTopic(actionUserid: number, topicType: string, page: number, count: number, db): Promise<ResultData> {
    try {
      const selectVoiceSentence = `select * from topic where topic_type = ?`
      const [rows, fileds] = await db.query(selectVoiceSentence, [topicType])
      rows.sort((a, b) => b.create_time - a.create_time);
      let result = rows.slice((page - 1) * count, page * count);

      let userPoll = {};
      for (let i = 0; i < result.length; i++) {
        let userinfo;
        let commentLen;
        let support;
        const item = result[i];
        const userid = item.user_id
        const topicid = item.topic_id
        if (userPoll[userid]) {
          userinfo = userPoll[userid];
          const supportPromise = this.getSupport(topicid, actionUserid, db);
          const commentLenPromise = this.getCommentLen(topicid, db);
          const [su, len] = await Promise.all([supportPromise, commentLenPromise])
          support = su;
          commentLen = len
        } else {
          const userPromise = this.getUser(userid, db);
          const commentLenPromise = this.getCommentLen(topicid, db)
          const supportPromise = this.getSupport(topicid, actionUserid, db);
          const [user, len, su] = await Promise.all([userPromise, commentLenPromise, supportPromise])
          commentLen = len;
          support = su
          userPoll[userid] = user
          userinfo = user;
        }
        const createTime = beforeTime(item.create_time);
        Object.assign(item, {
          user_name: userinfo.user_name,
          user_image: userinfo.user_image,
          create_time: createTime,
          comment: commentLen,
          support: support,
        });
      }
      return Object.assign({}, this.data, {
        message: '数据请求成功',
        data: result
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '数据请求失败',
      })
    }
  }
  async support(topicid: number, userid: number, db): Promise<ResultData> {
    try {
      const insertSupportSentence = `insert into support(user_id,support_type,topic_id) values(?,1,?)`
      const [rows, fileds] = await db.query(insertSupportSentence, [userid, topicid])
      const support = await this.getSupport(topicid, userid, db)
      return Object.assign({}, this.data, {
        message: '点赞成功',
        data: support
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '点赞失败'
      })
    }
  }
  async comment(releaseid: number, topicid: number, userid: number, commentContent: string, db): Promise<ResultData> {
    try {
      const insertCommentSentence = `insert into comment(release_id,topic_id,user_id,comment_content,create_time) values(?,?,?,?,?)`
      const createTime = Date.now();
      const [rows, fileds] = await db.query(insertCommentSentence, [releaseid, topicid, userid, commentContent, createTime])
      if (rows.affectedRows === 1) {
        return Object.assign({}, this.data, {
          message: '评论成功'
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log(err)
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '评论失败'
      })
    }
  }
  async getCommentList(topicid: number, page: number, count: number, db): Promise<ResultData> {
    try {
      const selectCommentSentence = `select * from comment where topic_id = ?`
      let [rows, fileds] = await db.query(selectCommentSentence, [topicid])
      rows.sort((a, b) => b.create_time - a.create_time)
      // 分页
      rows = rows.slice((page - 1) * count, page * count);
      for (let comment of rows) {
        const releaseid = comment.release_id
        const userid = comment.user_id
        let createTime = comment.create_time
        createTime = beforeTime(createTime)
        const releaseInfoPromise = this.getUser(releaseid, db)
        const userInfoPromise = this.getUser(userid, db)
        const [releaseInfo, userInfo] = await Promise.all([releaseInfoPromise, userInfoPromise])
        Object.assign(comment, {
          create_time: createTime,
          user_name: userInfo.user_name,
          release_name: releaseInfo.user_name
        })
      }
      return Object.assign({}, this.data, {
        message: '获取评论列表成功',
        data: rows
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取评论列表失败'
      })
    }
  }
  async releaseTopic(userid: number, topicType: string, content: string, images: Array<File>, db): Promise<ResultData> {
    try {
      const filesPath = await uploadOss('topic', images)
      const insertSentence = `insert into topic(user_id,topic_content,create_time,topic_type) values(?,?,?,?)`
      const createTime = Date.now()
      const contentJson = JSON.stringify({
        text: content,
        images: filesPath
      })
      const [rows, fileds] = await db.query(insertSentence, [userid, contentJson, createTime, topicType])
      return Object.assign({}, this.data, {
        message: '发布成功',
        data: rows
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '发布失败',
        data: err
      })
    }
  }
  async getUser(userid: number, db): Promise<any> {
    try {
      const selectUserSentence = `select * from user where user_id = ?`
      const [rows, fileds] = await db.query(selectUserSentence, [userid])
      return rows[0];
    } catch (err) {
      console.log(err);
      return {}
    }
  }
  async getCommentLen(topicid: number, db): Promise<unknown> {
    try {
      const selectCommentSentence = `select * from user where topic_id = ?`
      const [rows, fileds] = await db.query(selectCommentSentence, [topicid])
      return rows.length;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
  async getSupport(topicid: number, actionUserid: number, db): Promise<unknown> {
    try {
      const selectSupportSentence = `select * from support where topic_id = ? and support_type=1`;
      const [rows, fileds] = await db.query(selectSupportSentence, [topicid])
      const flag = rows.some(item => item.user_id === +actionUserid);
      return {
        action: !!flag,
        count: rows.length
      }
    } catch (err) {
      console.log(err)
      return {};
    }
  }
}