import { Controller, Get, BaseController } from 'kever'
@Controller()
export default class IndexController extends BaseController {
  @Get('/')
  async run() {
    const result = this.ctx.redis.set('wang', 'chong', this.ctx.redis.print)
    this.ctx.redis.get('wang', (err, data) => {
      if (err) {
        console.log(err)
      }
      console.log(data)
    })
    const data = await this.ctx.db.execute('SELECT * FROM `test` where `id` = ?', [2])
    this.ctx.body = data[0]
  }
}
