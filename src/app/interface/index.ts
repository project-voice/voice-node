interface EmailInterface {
  sendEmail(address: string, redis: any): Promise<unknown>
  checkIdentity(address: string, identity: string, redis: any): Promise<unknown>
}

interface UserInterface {
  register(params: unknown, db: any): Promise<unknown>
  login(username: string, email: string, password: string, db: any): Promise<unknown>
  forgetPassword(userid: number, password: string, db: any): Promise<unknown>
}
export { EmailInterface, UserInterface }
