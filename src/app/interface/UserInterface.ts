/**
 * 用户相关接口service约束
 */
export interface UserInterface {
  /**
   * 登录
   * @param email
   * @param password
   * @param db
   */
  login(platform: string, key: string, value: string, db: any): Promise<any>
  /**
   * 创建用户
   * @param email
   * @param username
   * @param password
   * @param db
   */
  createUser(email: string, username: string, password: string, db: any): Promise<any>
  /**
   * 根据key查找是否存在用户
   * @param key
   * @param value
   * @param db
   */
  findUser(key: string, value: string, db: any): Promise<any>
  /**
   * 更新用户信息
   * @param userId
   * @param key
   * @param value
   * @param db
   */
  updateUser(userId: number, key: string, value: string, db: any): Promise<any>
  /**
   * 查询所有用户
   */
  getUserList(db: any): Promise<any>
  /**
   * 禁用或启用用户
   */
  disableUser(userId: number, db: any): Promise<any>
  /**
   * 判断用户是否禁用
   */
  isDisable(userId: number, db: any): Promise<any>
}
