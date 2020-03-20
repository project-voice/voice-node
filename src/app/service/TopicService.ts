import { Injectable } from 'kever'
import { TopicInterface } from '../interface';
import { uploadOss } from '../utils'

@Injectable('topic')
export default class TopicService implements TopicInterface {
  async getTopicAllToFirst(count: number, db): Promise<any> {
    try {
      const selectVoiceSentence = `select * from topic order by create_time desc`
      const [rows] = await db.query(selectVoiceSentence)
      const allTopic = [];
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
      let topic_title = ['全部']
      result.forEach((topic, idx) => {
        const type = topic[0].topic_type;
        if (!topic_title[idx]) {
          topic_title[idx] = type;
        }
      });
      return {
        topic_title,
        topic_content: result
      }
    } catch (err) {
      return false
    }
  }
  async getTopic(topicType: string, page: number, count: number, db): Promise<any> {
    try {
      let selectVoiceSentence;
      if (topicType === '全部') {
        selectVoiceSentence = `select * from topic limit ${(page - 1) * count}, ${count} order by create_time desc`
      } else {
        selectVoiceSentence = `select * from topic where topic_type = ? limit ${(page - 1) * count} ${count} order by create_time desc`
      }
      const [rows] = await db.query(selectVoiceSentence, [topicType])
      return rows
    } catch (err) {
      return false
    }
  }
  async releaseTopic(userid: number, topicType: string, content: string, images: Array<File>, db): Promise<any> {
    try {
      const filesPath = await uploadOss('topic', images)
      const insertSentence = `insert into topic(user_id,topic_content,create_time,topic_type) values(?,?,?,?)`
      const createTime = Date.now()
      const contentJson = JSON.stringify({
        text: content,
        images: filesPath
      })
      const [rows] = await db.query(insertSentence, [userid, contentJson, createTime, topicType])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return true
    }
  }
  async getTopicAll(page: number, count: number, db: any): Promise<any> {
    try {
      const selectSentence = `select * from topic limit ${(page - 1) * count}, ${count}`
      const [rows] = await db.query(selectSentence)
      return rows
    } catch (err) {
      return false
    }
  }
  async getTopicListToSelf(userId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from topic where user_id = ?'
      const [rows] = await db.query(selectSentence, [userId])
      return rows
    } catch (err) {
      return false
    }
  }
  async deleteTopic(topicId: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from topic where topic_id = ?'
      const [rows] = await db.query(deleteSentence, [topicId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async disableTopic(topicId: number, db: any): Promise<any> {
    try {
      const isDisabled = await this.isDisabled(topicId, db)
      let value = 1
      if (isDisabled) {
        value = 1
      }
      const updateSentence = 'update topic set topic_status = ? where topic_id = ?'
      const [rows] = await db.query(updateSentence, [value, topicId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async isDisabled(topicId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select topic_status from topic where topic_id = ?'
      const [rows] = await db.query(selectSentence, [topicId])
      if (rows[0].topic_status == 1) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
}