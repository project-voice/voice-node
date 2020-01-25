import { Controller, BaseController, Post, Params } from 'kever'

@Controller()
export default class Login extends BaseController {
  @Post('/auth')
  async auth(@Params([]) params) {
    const phone = params.body.phone
  }
}
