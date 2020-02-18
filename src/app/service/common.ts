// 点赞相关
export const getSupport = async (videoid: number, supportType: number, db: any): Promise<any> => {
  const selectSupportSentence = `select user_id from support where topic_id=? and support_type=?`
  const [supports, fileds] = await db.query(selectSupportSentence, [videoid, supportType])
  return supports
}
export const insertSupport = async (userid: number, videoid: number, supportType: number, db: any): Promise<any> => {
  const insertSupportSentenct = `insert into support(user_id,topic_id,support_type) values(?,?,?)`
  const [rows, fileds] = await db.query(insertSupportSentenct, [userid, videoid, supportType])
  return rows
}
export const deleteSupport = async (userid: number, videoid: number, supportType: number, db: any): Promise<any> => {
  const deleteSupportSentenct = `delete from support where user_id=? and topic_id=? and support_type=?`
  const [rows, fileds] = await db.query(deleteSupportSentenct, [userid, videoid, supportType])
  return rows
}

// 评论相关
// export getComment = 

export const getCommentLen = async (topicid: number, commentType: number, db): Promise<any> => {
  try {
    const selectCommentSentence = `select * from comment where topic_id = ? and comment_type = ?`
    const [rows, fileds] = await db.query(selectCommentSentence, [topicid, commentType])
    return rows.length;
  } catch (err) {
    return 0;
  }
}

// 获取用户信息
export const getUser = async (userid: number, db): Promise<any> => {
  try {
    const selectUserSentence = `select * from user where user_id = ?`
    const [rows, fileds] = await db.query(selectUserSentence, [userid])
    return rows[0];
  } catch (err) {
    console.log(err);
    return {}
  }
}