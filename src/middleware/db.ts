import { registerGlobalMiddle, BaseMiddle } from 'kever'
import * as mysql from 'mysql2/promise'
import { mysql as mysqlConfig } from '../app/config'
@registerGlobalMiddle('db')
export default class DB implements BaseMiddle {
  private mysql
  constructor() {
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
    const connection = await mysql.createConnection(mysqlConfig)
    return connection
  }
  async ready(ctx, next) {
    ctx.db = this.mysql
    await next()
  }
}
