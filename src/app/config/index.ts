import bluebird from 'bluebird'

// 邮件配置
const email = {
  config: {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
      user: '1191340528@qq.com',
      pass: 'occzcuasbdczihij'
    }
  },
  message: {
    from: '1191340528 <1191340528@qq.com>',
    to: '',
    subject: 'voice邮箱验证码',
    html: ''
  }
}

// redis
const redis = {
  RDS_PORT: 6379,
  RDS_HOST: '127.0.0.1',
  RDS_OPTS: {}
}

// mysql
const mysql = {
  host: '39.105.106.168',
  user: 'root',
  password: 'goaway0806',
  database: 'voice',
  Promise: bluebird
}

export { email, redis, mysql }
