import { Injectable } from 'kever'
import { VideoInterface, ResultData } from '../interface';
import { uploadOss } from '../utils';

@Injectable('video')
export default class VideService implements VideoInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async releaseVideo(userid: number, description: string, video: File, db: any): Promise<ResultData> {
    try {
      const insertVideoSentence = `insert into video(user_id,video_url,video_description,create_time) values(?,?,?,?)`
      const [url] = await uploadOss('video', [video])
      const createTime = Date.now()
      const [rows, fileds] = await db.query(insertVideoSentence, [userid, url, description, createTime])
      if (rows.affectedRows === 1) {
        return Object.assign({}, this.data, {
          message: '发布成功'
        })
      } else {
        throw new Error()
      }

    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '发布失败',
        data: err
      })
    }
  }
  //获取关注的视频列表
  async getVideoListFollow(userid: number, count: number, page: number, db: any): Promise<ResultData> {
    return this.data;
  }
  //获取推荐的视频列表
  async getVideoListRecommend(userid: number, count: number, page: number, db: any): Promise<ResultData> {
    return this.data
  }
  async share(videoid: number, db: any): Promise<ResultData> {
    try {
      const updateShareSentence = `update video set video_share=? where video_id=?`
      const selectShareSentence = `select video_share from video where video_id=?`
      const [result] = await db.query(selectShareSentence, [videoid])
      const shareNum = result[0].video_share + 1
      const [rows] = await db.query(updateShareSentence, [shareNum, videoid])
      if (rows.affectedRows === 1) {
        return Object.assign({}, this.data, {
          message: '分享成功',
          data: {
            count: shareNum
          }
        })
      } else {
        throw new Error();
      }

    } catch (err) {
      return Object.assign({}, this.data, {
        noerr: 1,
        message: '分享失败',
        data: err
      })
    }
  }
}