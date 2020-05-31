
export interface FeedbackInterface {
  /**
   * 获取意见反馈列表
   * @param db 
   */
  getFeedbackList(db: any): Promise<any>
  /**
   * 发布一个意见
   * @param userid 
   * @param feedbackContent 
   */
  releaseFeedback(userid: number, feedbackContent: string, db: any): Promise<any>
  /**
   * 删除一个意见
   * @param feedbackid 
   */
  deleteFeedback(feedbackid: number, db: any): Promise<any>
  /**
   * 更新意见的状态
   * @param feedbackid 
   * @param feedbackStatus 
   */
  updateStatus(feedbackid: number, feedbackStatus: number, db: any): Promise<any>
  /**
   * 获取发布这条问题的用户id
   * @param feedbackid 
   * @param db 
   */
  getFeedback(feedbackid: number, db: any): Promise<any>
}
