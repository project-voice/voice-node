export interface AnswerInterface {
  /**
   * 获取答题列表
   * @param userId
   * @param stageNum 
   * @param db 
   */
  getAnswerList(stageNum: number, db: any)
  /**
   * 答题
   * @param userId 
   * @param questionId 
   * @param stageNum 
   * @param db 
   */
  createAnswer(userId: number, questionId: number, stageNum: number, db: any): Promise<any>
  /**
   * 通过用户获取答题列表
   * @param userId 
   * @param db 
   */
  getAnswerListByUser(userId: number, db: any): Promise<any>
}