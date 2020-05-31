import { Injectable } from 'kever'
import * as nodemailer from 'nodemailer'
import { email } from '../config/index'
import { createIdentity } from '../utils'
import { EmailInterface } from '../interface'
@Injectable('email')
export default class EmailService implements EmailInterface {
  private transporter
  constructor() {
    const config = email.config
    const transporter = nodemailer.createTransport(config)
    this.transporter = transporter
  }
  async sendEmail(userEmail: string, redis: any): Promise<any> {
    try {
      const sendMessage = email.message
      const identity = createIdentity(6)
      sendMessage.to = userEmail
      sendMessage.html = `<p>Hi， 你的激活验证码为${identity}</p>
        <p>验证码半小时有效，请妥善保管。</p>`

      const info = await this.transporter.sendMail(sendMessage)
      // 验证码存入redis,半小时失效
      redis.set(userEmail, identity, redis.print)
      redis.expire(userEmail, 10 * 60 * 30)
      return info
    } catch (err) {
      return false
    }
  }
  checkIdentity(userEmail: string, identity: string, redis: any): Promise<any> {
    return new Promise((resolve, reject) => {
      redis.get(userEmail, (err, data) => {
        if (err) {
          reject(false)
        }
        if (identity === data) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }
}
