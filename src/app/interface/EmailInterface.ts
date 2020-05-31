
/**
 * 邮箱相关接口service约束
 */
export interface EmailInterface {
  /**
   * 邮箱发送验证码
   * @param address
   * @param redis
   */
  sendEmail(address: string, redis: any): Promise<any>
  /**
   * 验证码check
   * @param address
   * @param identity
   * @param redis
   */
  checkIdentity(address: string, identity: string, redis: any): Promise<any>
}
