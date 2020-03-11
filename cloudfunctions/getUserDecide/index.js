// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const decides = db.collection('decides')

// 云函数入口函数
exports.main = async () => {
  const {OPENID: _openid} = cloud.getWXContext()

  try {
    const {data} = await decides.where({_openid}).orderBy('updateTime', 'desc').get()
    return data
  } catch (e) {
    console.log(e)
    return false
  }
}