export interface followInterface {
  /**
   * 关注
   * @param userid 
   * @param followid 
   * @param db 
   */
  follow(userid: number, followid: number, db: any): Promise<any>
  /**
   * 获取关注列表
   * @param userid 
   * @param db 
   */
  getFollowList(userid: number, db: any): Promise<any>
  /**
   * 取消关注
   * @param userid 
   * @param followid 
   * @param db 
   */
  cancelFollow(userid: number, followid: number, db: any): Promise<any>
  /**
   * 获取都有谁关注了当前用户
   * @param userid 
   * @param db 
   */
  getFollowed(userid: number, db: any): Promise<any>
}