import { registerGlobalMiddle, BaseMiddle } from 'kever'
import * as redis from 'redis'
import * as bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
@registerGlobalMiddle('redis')
export default class Redis implements BaseMiddle {
  private RDS_PORT = 6379
  private RDS_HOST = '39.105.106.168'
  private RDS_OPTS = {}
  public client
  constructor() {
    const client = redis.createClient(this.RDS_PORT, this.RDS_HOST, this.RDS_OPTS)
    client.on('connect', err => {
      console.log('redis connected')
    })
    this.client = client
  }
  async ready(ctx, next) {
    ctx.redisGet = this.client
    await next()
  }
  get(data) {
    return new Promise((resolve, reject) => {
      this.client.get(data, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }
  set(key, vlaue) {
    return new Promise((resolve, reject) => {
      this.client.set(key, vlaue, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }
}
