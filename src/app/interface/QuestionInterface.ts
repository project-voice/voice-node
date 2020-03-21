export interface QuestionInterface {
  /**
   * 获取某阶段的题目列表，如果没传，获取所有
   * @param stgeNum 
   * @param db 
   */
  getQuestionList(stgeNum: number, db: any): Promise<any>
  /**
   * 创建一个问题
   * @param questionInfo 
   * @param db 
   */
  createQuestion(questionInfo: any, db: any): Promise<any>
  /**
   * 更新问题信息
   * @param questionId 
   * @param questionInfo 
   * @param db 
   */
  updateQuestionInfo(questionId: number, questionInfo: any, db: any): Promise<any>
  /**
   * 删除一个问题
   * @param questionId 
   * @param db 
   */
  deleteQuestion(questionId: number, db: any): Promise<any>
}