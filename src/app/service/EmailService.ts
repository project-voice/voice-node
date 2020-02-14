import { Injectable } from 'kever'
import * as nodemailer from 'nodemailer'
import { email } from '../config/index'
import { createIdentity } from '../utils'
@Injectable('email')
export default class EmailService {
  private data = {
    noerr: 0,
    message: '',
    data: null
  }
  async sendEmail(address, redis) {
    try {
      const config = email.config
      const sendMessage = email.message
      const transporter = nodemailer.createTransport(config)
      const identity = createIdentity(6)
      sendMessage.to = address
      sendMessage.html = `<p>Hi， 你的激活验证码为${identity}</p>
        <p>验证码半小时有效，请妥善保管。</p>`

      const info = await transporter.sendMail(sendMessage)
      // 验证码存入redis,半小时失效
      redis.set(address, identity, redis.print)
      redis.expire(address, 10 * 60 * 30)

      return Object.assign(this.data, {
        message: 'success',
        data: info
      })
    } catch (err) {
      return Object.assign(this.data, {
        noerr: 1,
        data: err
      })
    }
  }
  checkIdentity(address, identity, redis): Promise<Object> {
    return new Promise((resolve, reject) => {
      redis.get(address, (err, data) => {
        if (err) {
          reject(
            Object.assign(this.data, {
              noerr: 1
            })
          )
        }
        if (identity === data) {
          resolve(
            Object.assign(this.data, {
              message: '验证成功'
            })
          )
        } else {
          resolve(
            Object.assign(this.data, {
              message: '验证失败，验证码不正确！'
            })
          )
        }
      })
    })
  }
}
