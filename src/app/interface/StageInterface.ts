export interface StageInterface {
  /**
   * 获取阶段列表
   * @param db 
   */
  getStageList(db: any): Promise<any>
  /**
   * 创建阶段
   * @param stageInfo 
   * @param db 
   */
  createStage(stageInfo: any, db: any): Promise<any>
  /**
   * 更新阶段信息
   * @param stageId 
   * @param stageInfo 
   * @param db 
   */
  updateStage(stageId: number, stageInfo: any, db: any): Promise<any>
  /**
   * 删除阶段
   * @param stageId 
   * @param db 
   */
  deleteStage(stageId: number, db: any): Promise<any>
  /**
   * 检查阶段是否存在
   * @param stageNum 
   * @param db 
   */
  checkStage(stageNum: number, db: any): Promise<any>
}