export interface CommentInterface {
  /**
   * 评论
   * @param topicid 
   * @param userid 
   * @param commentContent 
   * @param commentType 
   * @param db 
   */
  comment(topicid: number, userid: number, commentContent: string, commentType: number, db): Promise<any>
  /**
   * 获取评论列表
   * @param topicid 
   * @param commentType 
   * @param page 
   * @param count 
   * @param db 
   */
  getCommentList(topicid: number, commentType: number, page: number, count: number, db: any): Promise<any>
  /**
   * 删除特定target的评论
   * @param commentType 
   * @param targetId 
   * @param db 
   */
  deleteComment(commentType: number, targetId: number, db): Promise<any>
  /**
   * 获取target的评论条数
   * @param commentType 
   * @param targetId 
   * @param db 
   */
  getCommentCount(commentType: number, targetId: number, db: any): Promise<any>
}
