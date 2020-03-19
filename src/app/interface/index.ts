export interface ResultData {
  noerr: number,
  message: string,
  data: {} | null
}

export * from './EmailInterface'
export * from './UserInterface'
export * from './FollowInterface'
/**
 * 英语角主题相关接口service约束
 */
export interface TopicInterface {
  /**
   * 获取所有主题的发文
   * @param actionUserid 
   * @param page 
   * @param count 
   */
  getTopicAll(actionUserid: number, page: number, count: number, db: any): Promise<ResultData>
  /**
   * 获取特定主题的发文
   * @param actionUserid
   * @param type 
   * @param page 
   * @param count 
   */
  getTopic(actionUserid: number, topicType: string, page: number, count: number, db: any): Promise<ResultData>

  /**
   * 发布主题
   * @param userid 
   * @param topicType 
   * @param content 
   * @param images 
   */
  releaseTopic(userid: number, topicType: string, content: string, images: Array<File>, db: any): Promise<ResultData>
}

/**
 * 短视频相关接口service约束
 */
export interface VideoInterface {
  /**
   * 发布视频
   * @param userid 
   * @param description 
   * @param video 
   * @param db 
   */
  releaseVideo(userid: number, description: string, video: File, db: any): Promise<ResultData>
  /**
   * 获取关注视频列表
   * @param userid 
   * @param count 
   * @param page 
   * @param db 
   */
  getVideoListFollow(userid: number, followList: Array<number>, count: number, page: number, db: any): Promise<ResultData>
  /**
   * 获取推荐的视频列表
   * @param userid 
   * @param count 
   * @param page 
   * @param db 
   */
  getVideoListRecommend(userid: number, followList: Array<number>, count: number, page: number, db: any): Promise<ResultData>
  /**
   * 分享
   * @param videoid 
   * @param db 
   */
  share(videoid: number, db: any): Promise<ResultData>
  /**
   * 获取某一用户所发布的所有视频
   * @param userid 
   * @param db 
   */
  getVideos(userid: number, db: any): Promise<any>
  /**
   * 整合输出视频接口所需要的用户信息及点赞信息
   * @param videos 
   * @param actionUserid 
   * @param db 
   */
  normalVideoList(videos: Array<any>, followList: Array<number>, actionUserid: number, db: any): Promise<Array<any>>
}

export interface SupportInterface {
  /**
   * 通用点赞接口
   * @param userid 
   * @param topicid 
   * @param supportType 
   * @param db 
   */
  support(userid: number, topicid: number, supportType: number, db: any): Promise<ResultData>
}

export interface CommentInterface {
  /**
   * 评论
   * @param releaseid 
   * @param topicid 
   * @param userid 
   * @param commentContent 
   * @param commentType 
   * @param db 
   */
  comment(releaseid: number, topicid: number, userid: number, commentContent: string, commentType: number, db: any): Promise<ResultData>
  /**
   * 获取评论列表
   * @param topicid 
   * @param commentType 
   * @param page 
   * @param count 
   * @param db 
   */
  getCommentList(topicid: number, commentType: number, page: number, count: number, db: any): Promise<ResultData>
  /**
   * 评论删除
   * @param commentid 
   * @param db 
   */
  deleteComment(commentid: number, db): Promise<ResultData>
}

export interface FeedbackInterface {
  /**
   * 获取意见反馈列表
   * @param db 
   */
  getFeedbackList(db: any): Promise<ResultData>
  /**
   * 发布一个意见
   * @param userid 
   * @param feedbackContent 
   */
  releaseFeedback(userid: number, feedbackContent: string, db: any): Promise<ResultData>
  /**
   * 删除一个意见
   * @param feedbackid 
   */
  deleteFeedback(feedbackid: number, db: any): Promise<ResultData>
  /**
   * 更新意见的状态
   * @param feedbackid 
   * @param feedbackStatus 
   */
  updateStatus(feedbackid: number, feedbackStatus: number, db: any): Promise<ResultData>
  /**
   * 获取发布这条问题的用户id
   * @param feedbackid 
   * @param db 
   */
  getFeedback(feedbackid: number, db: any): Promise<any>
}

export interface MessageInterface {
  /**
   * 获取消息列表
   * @param userid 
   * @param db 
   */
  getMessageList(userid: number, followsid: Array<number>, db: any): Promise<ResultData>
  /**
   * 创建消息
   * @param userid 
   * @param title 
   * @param content 
   * @param db 
   */
  createMessage(userid: number, title: string, content: string, followList: Array<number>, db: any): Promise<any>
  /**
   * 创建消息提示数
   * @param userid 
   * @param db 
   */
  createTips(userid: number, db: any): Promise<any>
  /**
   * 获取消息提示数
   * @param userid 
   * @param db 
   */
  getTips(userid: number, db: any): Promise<any>
  /**
   * 已读，删除消息提示数
   * @param userid 
   * @param db 
   */
  deleteTips(userid: number, db: any): Promise<any>

}