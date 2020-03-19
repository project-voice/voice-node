import { Injectable } from 'kever'
import { UserInterface } from '../interface'
import { uploadOss } from '../utils'

@Injectable('user')
export default class UserService implements UserInterface {
  async login(platform: string, key: string, value: string, db: any): Promise<any> {
    try {
      let selectSentence;
      if (platform === 'mobile') {
        selectSentence = 'select * from user where user_email = ? and user_password = ?'
      } else {
        selectSentence = 'select * from admins where user_name = ? and user_password = ?'
      }
      const [rows] = await db.query(selectSentence, [key, value])
      console.log(rows, key, value);
      return rows[0]
    } catch (err) {
      console.log(err)
      return false
    }
  }
  async createUser(email: string, username: string, password: string, db: any): Promise<any> {
    try {
      const insertSentence = 'insert into user(user_email,user_name,user_password) values(?,?,?)'
      const [rows] = await db.query(insertSentence, [email, username, password])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async findUser(key: string, value: string, db: any): Promise<any> {
    try {
      const selectSentence = `select * from user where ${key} = ?`
      const [rows] = await db.query(selectSentence, [value])
      return rows[0]
    } catch (err) {
      return false
    }
  }
  async updateUser(userId: number, key: string, value: string | File, db: any): Promise<any> {
    try {
      let filesPath
      if (key === 'user_image') {
        filesPath = await uploadOss('user', [value as File])
        value = filesPath[0]
      }
      const updateSentence = `update user set ${key}=? where user_id = ?`
      const [rows] = await db.query(updateSentence, [value, userId])
      if (rows.affectedRows > 0) {
        return value
      }
      return false
    } catch (err) {
      console.log(err);
      return false
    }
  }
  async getUserList(db: any): Promise<any> {
    try {
      const selectSentence = 'select * from user'
      const [rows] = await db.query(selectSentence)
      return rows
    } catch (err) {
      return false
    }
  }
  async disableUser(userId: number, db: any): Promise<any> {
    try {
      const isDisable = await this.isDisable(userId, db)
      let value = 1
      if (isDisable) {
        value = 0
      }
      const updateSentence = 'update user set user_status = ? where user_id = ?'
      const [rows] = await db.query(updateSentence, [value, userId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async isDisable(userId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select user_status from user where user_id = ?'
      const [rows] = await db.query(selectSentence, [userId])
      if (rows[0].user_status == 0) {
        return false
      }
      return true
    } catch (err) {
      return false
    }
  }
}
