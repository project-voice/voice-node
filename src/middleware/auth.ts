import { registerMiddle, BaseMiddle } from 'kever'
import Redis from './redis'
@registerMiddle('auth')
export default class Auth implements BaseMiddle {
  private redis
  constructor() {
    const redis = new Redis().client
    this.redis = redis
  }
  async ready(ctx, next) {
    const headers = ctx.req.headers
    const voiceTicket = headers['voice-ticket']
    const phoneNum = voiceTicket.split('#')[0]
    this.redis.get(phoneNum, async (err, data) => {
      if (err || data !== voiceTicket) {
        ctx.body = {
          noerr: 1,
          errmsg: 'ticket 失效',
          data: null
        }
      }
      await next()
    })
  }
}
