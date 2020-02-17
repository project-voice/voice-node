export interface ResultData {
  noerr: number,
  message: string,
  data: {} | null
}

/**
 * 邮箱相关接口service约束
 */
export interface EmailInterface {
  /**
   * 邮箱发送验证码
   * @param address 
   * @param redis 
   */
  sendEmail(address: string, redis: any): Promise<ResultData>
  /**
   * 验证码check
   * @param address 
   * @param identity 
   * @param redis 
   */
  checkIdentity(address: string, identity: string, redis: any): Promise<ResultData>
}

/**
 * 用户相关接口service约束
 */
export interface UserInterface {
  /**
   * 用户注册
   * @param params 
   * @param db 
   */
  register(params: unknown, db: any): Promise<ResultData>
  /**
   * 用户登录
   * @param username 
   * @param email 
   * @param password 
   * @param db 
   */
  login(username: string, email: string, password: string, db: any): Promise<ResultData>
  /**
   * 修改用户信息
   * @param userid 
   * @param key 
   * @param value 
   * @param db 
   */
  updateInfo(userid: number, key: string, value: string, db: any): Promise<ResultData>
}

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
   * 点赞
   * @param topicid 
   * @param userid 
   */
  support(topicid: number, userid: number, db: any): Promise<ResultData>
  /**
   * 评论
   * @param releaseid 
   * @param topicid 
   * @param userid 
   * @param commentContent 
   */
  comment(releaseid: number, topicid: number, userid: number, commentContent: string, db: any): Promise<ResultData>
  /**
   * 获取评论列表
   * @param topicid 
   * @param db 
   */
  getCommentList(topicid: number, db: any): Promise<ResultData>
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
export interface VideoInterface { }


