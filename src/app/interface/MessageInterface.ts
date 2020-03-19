
export interface MessageInterface {
  /**
   * 获取消息列表
   * @param userid 
   * @param db 
   */
  getMessageList(userid: number, followsid: Array<number>, db: any): Promise<any>
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