export interface SupportInterface {
  /**
   * 获取target的点赞数
   * @param supportType 
   * @param userId 
   * @param targetId 
   * @param db 
   */
  getSupport(supportType: number, userId: number, targetId: number, db: any): Promise<any>
  /**
   * 点赞
   * @param userId 
   * @param targetId 
   * @param supportType 
   * @param db 
   */
  support(userId: number, targetId: number, supportType: number, db: any): Promise<any>
  /**
   * check用户是否已经点赞
   * @param supportType 
   * @param userId 
   * @param targetId 
   * @param db 
   */
  checkUser(supportType: number, userId: number, targetId: number, db: any): Promise<any>
  /**
   * 删除特定target的点赞
   * @param supportType 
   * @param targetId 
   * @param db 
   */
  deleteSupport(supportType: number, targetId: number, db: any): Promise<any>
}