// import { Controller, BaseController, Inject, Get, Params } from 'kever';

// @Controller('/message')
// export default class MessageController extends BaseController {
//   @Inject('message')
//   public messageService
//   @Inject('user')
//   public userService

//   @Get('/message-list')
//   async getMessageList(@Params(['query']) params) {
//     const { user_id: userid } = params
//     const { data: usersInfo } = await this.userService.getFollowList(userid, this.ctx.db)
//     // 当有关注的人的时候
//     let result;
//     if (usersInfo.length) {
//       const usersid = usersInfo.map(user => user.user_id)
//       result = await this.messageService.getMessageList(userid, usersid, this.ctx.db)
//     } else {
//       result = {
//         noerr: 0,
//         message: '暂无系统消息',
//         data: null
//       }
//     }
//     this.ctx.body = result;
//   }
//   @Get('/get-tips')
//   async getTips(@Params(['query']) params) {
//     const { user_id: userid } = params;
//     const result = await this.messageService.getTips(userid, this.ctx.db)
//     this.ctx.body = result
//   }
// }