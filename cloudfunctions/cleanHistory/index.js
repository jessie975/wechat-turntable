// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const users = db.collection('users')

// 云函数入口函数
exports.main = async () => {
  const {OPENID: _openid} = cloud.getWXContext()

  try {
    await users.where({_openid}).update({
      data: {history: []}
    })
    return '成功清空'
  } catch (error) {
    return '清空失败'
  }
}