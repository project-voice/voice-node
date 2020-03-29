import { Injectable } from 'kever'
import { baseUrlToOOS } from '../utils';
import { StageInterface } from '../interface';

@Injectable('stage')
export default class StageService implements StageInterface {
  async getStageList(db: any): Promise<any> {
    try {
      const selectSentence = 'select * from stage'
      const [rows] = await db.query(selectSentence)
      return rows
    } catch (err) {
      return false;
    }
  }
  async createStage(stageInfo: any, db: any): Promise<any> {
    try {
      const bannerImage = await baseUrlToOOS('stage', stageInfo.stageImage)
      const createTime = Date.now();
      const insertSentence = 'insert into stage(stage_num,stage_title,stage_banner,stage_description,stage_tag,create_time) values(?,?,?,?,?,?)'
      const [rows] = await db.query(insertSentence, [
        stageInfo.stageNum,
        stageInfo.stageTitle,
        bannerImage,
        stageInfo.stageDescription,
        stageInfo.stageTag,
        createTime
      ])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async updateStage(stageId: number, stageInfo: any, db: any): Promise<any> {
    try {
      const createTime = Date.now()
      let bannerUrl
      if (stageInfo.stageImage.split(':')[0] === 'http') {
        bannerUrl = stageInfo.stageImage
      } else {
        bannerUrl = await baseUrlToOOS('advisory', stageInfo.stageImage)
      }
      const updateSentence = ` update stage set
      stage_num=?,
      stage_title=?,
      stage_banner=?,
      stage_description=?,
      stage_tag=?,
      create_time=? where stage_id = ?
      `
      const [rows] = await db.query(updateSentence, [
        stageInfo.stageNum,
        stageInfo.stageTitle,
        bannerUrl,
        stageInfo.stageDescription,
        stageInfo.stageTag,
        createTime,
        stageId,
      ])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async deleteStage(stageId: number, db: any): Promise<any> {
    try {
      const deleteSentence = 'delete from stage where stage_id = ?'
      const [rows] = await db.query(deleteSentence, [stageId])
      if (rows.affectedRows > 0) {
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }
  async checkStage(stageNum: number, db: any): Promise<any> {
    try {
      const selectSentence = 'select * from stage where stage_num = ?'
      const [rows] = await db.query(selectSentence, [stageNum])
      if (rows.length == 0) {
        return false
      }
      return true
    } catch (err) {
      return false
    }
  }
}
