import { Injectable } from 'kever'
import { TopicInterface, ResultData } from '../interface';
import { uploadOss, beforeTime } from '../utils'
import { getSupport, getUser } from './common'

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
            const userPromise = getUser(userid, db);
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
          const userPromise = getUser(userid, db);
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
  async getCommentLen(topicid: number, db): Promise<any> {
    try {
      const selectCommentSentence = `select * from user where topic_id = ? and comment_type = 1`
      const [rows, fileds] = await db.query(selectCommentSentence, [topicid])
      return rows.length;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
  async getSupport(topicid: number, actionUserid: number, db): Promise<any> {
    try {
      const result = await getSupport(topicid, 1, db)
      const flag = result.some(item => item.user_id === +actionUserid);
      return {
        action: !!flag,
        count: result.length
      }
    } catch (err) {
      console.log(err)
      return {};
    }
  }
}