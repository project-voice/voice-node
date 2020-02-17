import { Injectable } from 'kever'
import { ResultData, SupportInterface } from '../interface'
import { getSupport, insertSupport, deleteSupport } from './common'

@Injectable('support')
export default class SupportService implements SupportInterface {
  public data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async support(userid: number, topicid: number, supportType: number, db: any): Promise<ResultData> {
    try {
      const supports = await getSupport(topicid, supportType, db)
      const isSupport = supports.some(item => item.user_id == userid)
      if (!isSupport) {
        const result = await insertSupport(userid, topicid, supportType, db)
        if (result.affectedRows == 1) {
          return Object.assign({}, this.data, {
            message: '点赞成功',
            data: {
              action: true,
              count: supports.length + 1
            }
          })
        } else {
          throw new Error()
        }
      } else {
        const result = await deleteSupport(userid, topicid, supportType, db)
        if (result.affectedRows == 1) {
          return Object.assign({}, this.data, {
            message: '取消点赞',
            data: {
              action: false,
              count: supports.length - 1
            }
          })
        } else {
          throw new Error()
        }
      }
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '点赞失败'
      })
    }
  }
}