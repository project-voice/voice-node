import * as OSS from 'ali-oss';
import { createWriteStream, createReadStream } from 'fs'

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI4Fog6hpirGjSxsMgfBd5',
  accessKeySecret: 'uKryPctQWPJQaCgdGF9F6SsSB4nsan',
  bucket: 'kimvoice',
  timeout: 6000000
})
/**
 * 生成验证码
 * @param num 
 */
export const createIdentity = (num: number): string => {
  const idenList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let identity = ''
  for (let i = 0; i < num; i++) {
    let random = Math.floor(Math.random() * idenList.length)
    identity += idenList[random]
  }

  return identity
}


/**
 * 调阿里云oss
 */
export const uploadOss = async (dir: string, files: Array<File>) => {
  const filesPath: Array<String> = []
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i] as any;
      const result = await client.put(`voice/${dir}/${file.name}`, file.path)
      filesPath.push(result.url)
    }
    return filesPath
  } catch (err) {
    console.log('err:', err)
  }
}

export const beforeTime = (time: number) => {
  if (Number.isNaN(+time)) return time;
  const now = new Date().getTime();
  let diff = Math.floor((now - time) / 1000);

  if (diff < 60) {
    return `${diff}秒前`
  }
  diff = Math.floor(diff / 60);
  // console.log(diff)
  if (diff < 60) {
    return `${diff}分钟前`
  }
  // console.log(diff)
  diff = Math.floor(diff / 60);
  if (diff < 24) {
    return `${diff}小时前`
  }
  diff = Math.floor(diff / 24);
  if (diff < 31) {
    return `${diff}天前`
  }
  diff = Math.floor(diff / 30);
  if (diff < 12) {
    return `${diff}月前`
  }
  diff = Math.floor(diff / 12);
  return `${diff}年前`
}

export const upload = async (file: any) => {
  const reader = await createReadStream(file.path);
  const ext = file.name.split('.').pop();
  const path = `/${Date.now()}.${ext}`;
  const upStream = await createWriteStream(`upload${path}`);
  await reader.pipe(upStream);
  return `118.89.217.151/voice${path}`;
}