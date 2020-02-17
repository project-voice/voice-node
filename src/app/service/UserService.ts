import { Injectable } from 'kever'
import { UserInterface, ResultData } from '../interface'
import { uploadOss } from '../utils'

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
      console.log('result:', rows, fields)
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
  async login(username: string, email: string, password: string, db: any): Promise<ResultData> {
    try {
      let querySentence: string
      let key: string
      if (username) {
        querySentence = 'select * from `user` where `user_name` = ? and `user_password` = ?'
        key = username
      } else {
        querySentence = 'select * from `user` where `user_email` = ? and `user_password` = ?'
        key = email
      }
      const [row, fields] = await db.query(querySentence, [key, password])
      if (row.length) {
        return Object.assign({}, this.data, {
          message: '登录成功',
          data: row[0]
        })
      } else {
        return Object.assign({}, this.data, {
          noerr: 1,
          message: '登录失败'
        })
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '登录失败',
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
      console.log('value', value)
      const updateSentence = `update user set ${key} = ? where user_id = ?`
      const [rows, fields] = await db.query(updateSentence, [value, userid])
      if (rows.affectedRows) {
        return Object.assign({}, this.data, {
          message: '修改成功'
        })
      } else {
        return Object.assign({}, this.data, {
          noerr: 1,
          message: '修改失败'
        })
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '修改失败',
        data: err
      })
    }
  }
}
