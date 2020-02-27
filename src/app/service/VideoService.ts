import { Injectable } from 'kever'
import { VideoInterface, ResultData } from '../interface';
import { uploadOss, beforeTime, upload } from '../utils';
import { getSupport, getUser, getCommentLen } from './common'

@Injectable('video')
export default class VideService implements VideoInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async releaseVideo(userid: number, description: string, video: File, ctx: any): Promise<ResultData> {
    try {
      const insertVideoSentence = `insert into video(user_id,video_url,video_description,create_time) values(?,?,?,?)`
      const [url] = await uploadOss('video', [video])
      console.log('url', url);
      const createTime = Date.now()
      const [rows, fileds] = await ctx.db.query(insertVideoSentence, [userid, url, description, createTime])
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
  async getVideoListFollow(actionUserid: number, followList: Array<number>, count: number, page: number, db: any): Promise<any> {
    try {
      const followListPromise = followList.map(followid => this.getVideos(followid, db))
      let followVideoList = await Promise.all(followListPromise)
      followVideoList = followVideoList.reduce((result, follow) => result.concat(follow), [])
        .sort((a, b) => b.create_time - a.create_time)

      followVideoList = await this.normalVideoList(followVideoList, followList, actionUserid, db)
      return followVideoList
    } catch (err) {
      console.log(err);
      return []
    }
  }
  //获取推荐的视频列表
  async getVideoListRecommend(actionUserid: number, followList: Array<number>, count: number, page: number, db: any): Promise<any> {
    try {
      const selectVideoSentence = `select * from video`
      let [videos, fileds] = await db.query(selectVideoSentence)
      videos.sort((a, b) => b.create_time - a.create_time)
      videos = await this.normalVideoList(videos, followList, actionUserid, db)
      return videos
    } catch (err) {
      return {}
    }
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
  async getVideos(userid: number, db: any): Promise<any> {
    try {
      const selectVideoSentence = `select * from video where user_id = ?`
      let [videos, fileds] = await db.query(selectVideoSentence, [userid])
      return videos
    } catch (err) {
      return []
    }
  }
  async normalVideoList(videos: Array<any>, followList: Array<number>, actionUserid: number, db: any): Promise<Array<any>> {
    let userPoll = new Map()
    for (let video of videos) {
      const videoid = video.video_id
      const userid = video.user_id
      const isFollow = followList.some(id => id == userid)
      let supports, userInfo, commentLen
      if (userPoll.has(userid)) {
        const supportsPromise = getSupport(videoid, 0, db)
        const commentLenPromise = getCommentLen(videoid, 0, db)
        const resultData = await Promise.all([supportsPromise, commentLenPromise])
        supports = resultData[0]
        commentLen = resultData[1]
        userInfo = userPoll.get(userid)
      } else {
        const supportsPromise = getSupport(videoid, 0, db)
        const userInfoPromise = getUser(userid, db)
        const commentLenPromise = getCommentLen(videoid, 0, db)
        const resultData = await Promise.all([supportsPromise, userInfoPromise, commentLenPromise])
        supports = resultData[0]
        userInfo = resultData[1]
        commentLen = resultData[2]
        userPoll.set(userid, userInfo)
      }
      const isSupport = supports.some(item => item.user_id == actionUserid)
      Object.assign(video, {
        user_name: userInfo.user_name,
        user_image: userInfo.user_image,
        create_time: beforeTime(video.create_time),
        comment: commentLen,
        follow: isFollow,
        support: {
          action: isSupport,
          count: supports.length
        }
      })
    }
    return videos
  }
}