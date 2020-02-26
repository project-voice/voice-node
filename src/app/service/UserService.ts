import { Injectable } from 'kever'
import { UserInterface, ResultData } from '../interface'
import { uploadOss } from '../utils'
import { getUser } from './common'

@Injectable('user')
export default class UserService implements UserInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  /**
   * 注册
   * @param params
   * @param db
   */
  async register(params: any, db: any): Promise<ResultData> {
    try {
      const { user_name: username, user_password: password, user_email: email } = params
      const createTime = Date.now()
      const insertSentence = `insert into user(user_name,user_password,user_email,create_time) values(?,?,?,?)`
      const [rows, fields] = await db.query(insertSentence, [username, password, email, createTime])
      // 自己关注自己
      await this.follow(rows.insertId, rows.insertId, db);
      return Object.assign({}, this.data, {
        message: '注册成功'
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '注册失败',
        data: err
      })
    }
  }
  /**
   * 登录
   * @param username
   * @param email
   * @param password
   * @param db
   */
  async login(email: string, password: string, db: any): Promise<ResultData> {
    try {
      let querySentence = 'select * from `user` where `user_email` = ? and `user_password` = ?'
      const [row, fields] = await db.query(querySentence, [email, password])
      if (row.length) {
        return Object.assign({}, this.data, {
          message: '登录成功',
          data: row[0]
        })
      } else {
        return Object.assign({}, this.data, {
          noerr: 1,
          message: '您的邮箱或密码输入错误！'
        })
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '您的邮箱或密码输入错误！',
        data: err
      })
    }
  }
  /**
   * 找回密码
   * @param userid
   * @param password
   * @param db
   */
  async updateInfo(userid: number, key: string, value: string | File, db: any): Promise<ResultData> {
    try {
      let filesPath;
      if (key === 'user_image') {
        filesPath = await uploadOss('user', [value as File])
        value = filesPath[0]
      }
      const updateSentence = `update user set ${key} = ? where user_id = ?`
      const [rows, fields] = await db.query(updateSentence, [value, userid])
      if (rows.affectedRows) {
        return Object.assign({}, this.data, {
          message: '修改成功',
          data: value
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '修改失败',
        data: err
      })
    }
  }
  async follow(userid: number, followid: number, db: any): Promise<ResultData> {
    try {
      const insertFollowSentence = `insert into follow(user_id,followuser_id) values(?,?)`
      const [rows, fields] = await db.query(insertFollowSentence, [userid, followid])
      if (rows.affectedRows == 1) {
        return Object.assign({}, this.data, {
          message: '关注成功'
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '关注失败',
        data: err
      })
    }
  }
  async getFollowList(userid: number, db: any): Promise<ResultData> {
    try {
      const selectFollowSentence = `select followuser_id from follow where user_id = ?`
      const [rows, fields] = await db.query(selectFollowSentence, [userid])
      const followList: Array<number> = rows.reduce((list, item) => list.concat([item.followuser_id]), [])
      const usersPromise = followList.map(userid => getUser(userid, db))
      const usersInfo = await Promise.all(usersPromise)
      return Object.assign({}, this.data, {
        message: '获取列表成功',
        data: usersInfo
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取列表失败',
        data: err
      })
    }
  }
  async cancelFollow(userid: number, followid: number, db: any): Promise<ResultData> {
    try {
      const deleteSentence = `delete from follow where user_id=? and followuser_id=?`
      const [rows, fileds] = await db.query(deleteSentence, [userid, followid])
      if (rows.affectedRows === 1) {
        return Object.assign({}, this.data, {
          message: '取消成功'
        })
      } else {
        throw new Error()
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '取消失败',
        data: err
      })
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
