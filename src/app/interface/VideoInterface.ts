export interface VideoInterface {
  /**
   * 发布视频
   * @param userid 
   * @param description 
   * @param video 
   * @param image 
   * @param ctx 
   */
  releaseVideo(userid: number, description: string, video: File, image: File, ctx: any): Promise<any>
  /**
   * 获取关注的视频
   * @param followList 
   * @param db 
   */
  getVideoListFollow(followList: Array<number>, db: any): Promise<any>
  /**
   * 获取推荐的视频
   * @param db 
   */
  getVideoListRecommend(db: any): Promise<any>
  /**
   * 分享
   * @param videoid 
   * @param db 
   */
  share(videoid: number, db: any): Promise<any>
  /**
   * 获取某用户所有的视频
   * @param userid 
   * @param db 
   */
  getVideos(userid: number, db: any): Promise<any>
  /**
   * 删除视频
   * @param videoId 
   * @param db 
   */
  deleteVideo(videoId: number, db: any): Promise<any>
  /**
   * 禁/启 用
   * @param videoId 
   * @param db 
   */
  disableVideo(videoId: number, db: any): Promise<any>
  /**
   * 检查一个视频是否禁用
   * @param videoId 
   * @param db 
   */
  isDisabled(videoId: number, db: any): Promise<any>
}