import { Injectable } from 'kever';
import { MessageInterface, ResultData } from '../interface';
import { beforeTime } from '../utils';

@Injectable('message')
export default class MessageService implements MessageInterface {
  public data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async getMessageList(userid: number, followsid: Array<number>, db: any): Promise<ResultData> {
    try {
      const selectSentence = 'select * from message'
      const [rows, fileds] = await db.query(selectSentence)
      // 获取消息列表
      const messageList = rows
        .filter(item => followsid.includes(item.user_id))
        .sort((a, b) => a.create_time - b.create_time)
        .map(item => {
          let createTime = item.create_time
          let [year, month, day] = new Date(+createTime).toLocaleDateString().split('-')
          let [nowYear, nowMonth, nowDay] = new Date().toLocaleDateString().split('-')
          let timeTxt: string | number = `${year}-${month}-${day}`;
          if (year == nowYear && month == nowMonth) {
            const time = new Date(+createTime).toLocaleTimeString()
            if (+day == +nowDay) {
              timeTxt = `今天 ${time}`;
            }
            if (((+day) + 1) == +nowDay) {
              timeTxt = `昨天 ${time}`

            }
          }
          return Object.assign({}, item, {
            create_time: timeTxt
          })
        })
      // 得到消息列表之后，将tips中用户信息删除。
      await this.deleteTips(userid, db);
      return Object.assign({}, this.data, {
        message: '获取列表成功',
        data: messageList
      })

    } catch (err) {
      console.log(err)
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取列表失败'
      })
    }
  }
  async createMessage(userid: number, title: string, content: string, followList: Array<number>, db: any): Promise<any> {
    try {
      const insertSentence = 'insert into message(user_id,message_title,message_content,create_time) values(?,?,?,?)'
      const createTime = Date.now()
      const [rows, fileds] = await db.query(insertSentence, [userid, title, content, createTime])
      const tipPromise = followList.map(userid => this.createTips(userid, db))
      const tipResult = await Promise.all(tipPromise);

      if (rows.affectedRows == 1 && tipResult.every(item => item)) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async createTips(userid: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from tips where user_id = ?'
      const updateSentence = 'update tips set tip_count = ? where user_id = ?'
      const insertSentence = 'insert into tips(user_id,tip_count) values(?,1)'
      const [rows, fileds] = await db.query(selectSentence, [userid])
      let flag;
      console.log(rows)
      if (rows.length) {
        let result = await db.query(updateSentence, [Number(rows[0].tip_count) + 1, userid])
        flag = result[0]
      } else {
        let result = await db.query(insertSentence, [userid])
        flag = result[0]
      }
      if (flag.affectedRows == 1) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async getTips(userid: number, db: any): Promise<ResultData> {
    try {
      const selectSentence = 'select * from tips where user_id = ?'
      const [rows, fileds] = await db.query(selectSentence, [userid])
      if (rows.length == 1) {
        return Object.assign({}, this.data, {
          message: '请求成功',
          data: rows[0].tip_count
        })
      } else {
        return Object.assign({}, this.data, {
          message: '请求成功',
          data: 0
        })
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '请求失败',
        data: 0
      })
    }
  }
  async deleteTips(userid: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from tips where user_id = ?'
      const [rows, fileds] = await db.query(deleteSentence, [userid])
      if (rows.affectedRows == 1) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
}