export interface TopicInterface {
  /**
   * to Mobile 获取第一页的数据
   * @param page 
   * @param count 
   * @param db 
   */
  getTopicAllToFirst(page: number, count: number, db): Promise<any>
  /**
   * to Mobile 获取下一页的数据
   * @param topicType 
   * @param page 
   * @param count 
   * @param db 
   */
  getTopic(topicType: string, page: number, count: number, db): Promise<any>
  /**
   * 发布一个话题
   * @param userid 
   * @param topicType 
   * @param content 
   * @param images 
   * @param db 
   */
  releaseTopic(userid: number, topicType: string, content: string, images: Array<File>, db): Promise<any>
  /**
   * to PC 获取话题列表---分页
   * @param page 
   * @param count 
   * @param db 
   */
  getTopicAll(page: number, count: number, db: any): Promise<any>
  /**
   * 删除话题
   * @param topicId 
   * @param db 
   */
  deleteTopic(topicId: number, db: any): Promise<any>
  /**
   * 禁/启 用话题
   * @param topicId 
   * @param db 
   */
  disableTopic(topicId: number, db: any): Promise<any>
  /**
   * 检测话题是否禁用
   * @param topicId 
   * @param db 
   */
  isDisabled(topicId: number, db: any): Promise<any>
}