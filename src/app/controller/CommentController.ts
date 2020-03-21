import { Controller, BaseController, Inject, Get, Params } from 'kever'
import { createResultData } from '../utils'

@Controller('/comment')
export default class CommentController extends BaseController {
  @Inject('comment')
  public commentService
  @Inject('user')
  public userService

  @Get('/comment')
  async comment(@Params(['query']) params) {
    let resultData
    try {
      const { type, target_id: targetId, user_id: userid, comment_content: commentContent } = params
      const result = await this.commentService.comment(targetId, userid, commentContent, type, this.ctx.db)
      if (!result) {
        throw new Error('评论失败')
      }
      resultData = createResultData({
        message: '评论成功'
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }

    this.ctx.body = resultData
  }
  @Get('/comment-list')
  async getCommentList(@Params(['query']) params) {
    let resultData
    try {
      const { target_id: targetId, page, count, type } = params
      const result = await this.commentService.getCommentList(targetId, type, page, count, this.ctx.db)
      const processComment = []
      for (let comment of result) {
        const userInfo = await this.userService.findUser('user_id', comment.user_id, this.ctx.db)
        processComment.push(Object.assign(comment, {
          user_name: userInfo.user_name,
          user_image: userInfo.user_image
        }))
      }
      resultData = createResultData({
        message: '请求成功',
        data: processComment,
      })
    } catch (err) {
      resultData = createResultData({
        noerr: 1,
        message: err.message
      })
    }
    this.ctx.body = resultData;
  }
}