import { Injectable } from 'kever'
import { TopicInterface, ResultData } from '../interface';

@Injectable('topic')
export default class TopicService implements TopicInterface {
  private data: ResultData = {
    noerr: 0,
    message: '',
    data: null
  }
  async getTopicAll(page: number, count: number, db): Promise<ResultData> {
    return this.data;
  }
  async getTopic(typeid: number, page: number, count: number, db): Promise<ResultData> {
    return this.data
  }
  async support(typeid: number, topicid: number, userid: number, db): Promise<ResultData> {
    return this.data
  }
  async comment(typeid: number, topicid: number, userid: number, commentContent: string, db): Promise<ResultData> {
    return this.data
  }
  async releaseTopic(userid: number, topicType: string, content: string, images: Array<File>, db): Promise<ResultData> {
    return this.data
  }
}