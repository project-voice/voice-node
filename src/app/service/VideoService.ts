import { Injectable } from 'kever'
import { VideoInterface, ResultData } from '../interface';
import { uploadOss, beforeTime } from '../utils';
import { getSupport, getUser, getCommentLen } from './common'

@Injectable('video')
export default class VideService implements VideoInterface {
  async releaseVideo(userid: number, description: string, video: File, image: File, ctx: any): Promise<any> {
    try {
      const insertVideoSentence = `insert into video(user_id,video_url,video_banner,video_description,create_time) values(?,?,?,?,?)`
      const [videoUrl, bannerUrl] = await uploadOss('video', [video, image])
      const createTime = Date.now()
      const [rows] = await ctx.db.query(insertVideoSentence, [userid, videoUrl, bannerUrl, description, createTime])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  //获取关注的视频列表
  async getVideoListFollow(followList: Array<number>, db: any): Promise<any> {
    try {
      const followListPromise = followList.map(followId => this.getVideos(followId, db))
      let followVideoList = await Promise.all(followListPromise)
      followVideoList = followVideoList.reduce((result, follow) => result.concat(follow), [])
      return followVideoList
    } catch (err) {
      console.log(err);
      return false
    }
  }
  //获取推荐的视频列表
  async getVideoListRecommend(db: any): Promise<any> {
    try {
      const selectVideoSentence = `select * from video order by create_time desc`
      let [videos] = await db.query(selectVideoSentence)
      return videos
    } catch (err) {
      return false
    }
  }
  async share(videoid: number, db: any): Promise<any> {
    try {
      const updateShareSentence = `update video set video_share=? where video_id=?`
      const selectShareSentence = `select video_share from video where video_id=?`
      const [result] = await db.query(selectShareSentence, [videoid])
      const shareNum = result[0].video_share + 1
      const [rows] = await db.query(updateShareSentence, [shareNum, videoid])
      if (rows.affectedRows > 0) {
        return shareNum
      }
      return 0
    } catch (err) {
      return false
    }
  }
  async getVideos(userid: number, db: any): Promise<any> {
    try {
      const selectVideoSentence = `select * from video where user_id = ?`
      let [videos, fileds] = await db.query(selectVideoSentence, [userid])
      return videos
    } catch (err) {
      return []
    }
  }
  async deleteVideo(videoId: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from video where video_id = ?'
      const [rows] = await db.query(deleteSentence, [videoId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async disableVideo(videoId: number, db: any): Promise<any> {
    try {
      const isDisabled = await this.isDisabled(videoId, db)
      const updateSentence = 'update video set video_status = ? where video_id = ?'
      let value = 1
      if (isDisabled) {
        value = 0
      }
      const [rows] = await db.query(updateSentence, [value, videoId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async isDisabled(videoId: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select video_status from video where video_id = ?'
      const [rows] = await db.query(selectSentence, [videoId])
      if (rows[0].video_status == 1) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
}