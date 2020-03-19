export interface ResultData {
  noerr: number,
  message: string,
  data: {} | null
}

export * from './EmailInterface'
export * from './UserInterface'
export * from './FollowInterface'
export * from './FeedbackInterface'
export * from './MessageInterface'
export * from './CommentInterface'
export * from './SupportInterface'
export * from './TopicInterface'

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

