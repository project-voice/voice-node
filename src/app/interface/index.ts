/**
 * 邮箱相关接口service约束
 */
interface EmailInterface {
  /**
   * 邮箱发送验证码
   * @param address 
   * @param redis 
   */
  sendEmail(address: string, redis: any): Promise<unknown>
  /**
   * 验证码check
   * @param address 
   * @param identity 
   * @param redis 
   */
  checkIdentity(address: string, identity: string, redis: any): Promise<unknown>
}

/**
 * 用户相关接口service约束
 */
interface UserInterface {
  /**
   * 用户注册
   * @param params 
   * @param db 
   */
  register(params: unknown, db: any): Promise<unknown>
  /**
   * 用户登录
   * @param username 
   * @param email 
   * @param password 
   * @param db 
   */
  login(username: string, email: string, password: string, db: any): Promise<unknown>
  /**
   * 修改用户信息
   * @param userid 
   * @param key 
   * @param value 
   * @param db 
   */
  updateInfo(userid: number, key: string, value: string, db: any): Promise<unknown>
}

/**
 * 英语角主题相关接口service约束
 */
interface TopicInterface {

}

/**
 * 短视频相关接口service约束
 */
interface VideoInterface { }


export { EmailInterface, UserInterface, TopicInterface, VideoInterface }
