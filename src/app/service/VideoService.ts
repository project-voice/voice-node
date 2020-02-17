import { Injectable } from 'kever'
import { VideoInterface, ResultData } from '../interface';

@Injectable('video')
export default class VideService implements VideoInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
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