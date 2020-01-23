import { registerGlobalMiddle, BaseMiddle } from 'kever'
import * as mysql from 'mysql2/promise'
import bluebird from 'bluebird'

@registerGlobalMiddle('db')
export default class DB implements BaseMiddle {
  private baseInfo
  private mysql
  constructor() {
    this.baseInfo = {
      host: '39.105.106.168',
      user: 'root',
      password: 'goaway0806',
      database: 'voice',
      Promise: bluebird
    }
    this.initMysql()
      .then(mysql => {
        this.mysql = mysql
        console.log('mysql connected')
      })
      .catch(err => {
        console.log(`[kever|error] ${JSON.stringify(err)}`)
      })
  }
  async initMysql() {
    const connection = await mysql.createConnection(this.baseInfo)
    return connection
  }
  async ready(ctx, next) {
    ctx.db = this.mysql
    await next()
  }
}
