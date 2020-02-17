import { Injectable } from 'kever'
import { VideoInterface, ResultData } from '../interface';

@Injectable('video')
export default class VideService implements VideoInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async getVideoListAll(userid: number, count: number, db: any): Promise<ResultData> {
    try {
      const followPromise = this.getVideoListFollow(userid, count, 1, db)
      const recommendPromise = this.getVideoListRecommend(userid, count, 1, db)
      const [follow, recommend] = await Promise.all([followPromise, recommendPromise])
      return Object.assign({}, this.data, {
        message: '获取视频列表成功',
        data: {
          follow,
          recommend
        }
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取视频列表失败'
      })
    }
  }
  async getVideoList(userid: number, count: number, page: number, type: string, db): Promise<ResultData> {
    try {
      let result;
      if (type === 'follow') {
        result = await this.getVideoListFollow(userid, count, page, db)
      } else {
        result = await this.getVideoListRecommend(userid, count, page, db)
      }
      return Object.assign({}, this.data, {
        message: '获取视频列表成功',
        data: result
      })
    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '获取视频列表失败'
      })
    }
    return this.data
  }
  async support(userid: number, videoid: number, db: any): Promise<ResultData> {
    return this.data
  }
  async releaseVideo(userid: number, description: string, video: File, db: any): Promise<ResultData> {
    return this.data
  }
  async comment(releaseid: number, userid: number, videoid: number, commentContent: string, db: any): Promise<ResultData> {
    return this.data;
  }
  async getCommentList(videoid: number, page: number, count: number, db: any): Promise<ResultData> {
    return this.data;
  }
  //获取关注的视频列表
  async getVideoListFollow(userid: number, count: number, page: number, db: any): Promise<ResultData> {
    return this.data;
  }
  //获取推荐的视频列表
  async getVideoListRecommend(userid: number, count: number, page: number, db: any): Promise<ResultData> {
    return this.data
  }

}