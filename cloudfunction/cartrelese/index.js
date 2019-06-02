// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {cartId, openid} = event
  console.log(event)
  try {
    const result = await db.collection('cart').where({
      _openid: openid,
      _id: cartId
    }).remove()
    if (result) {
      context.body = {
        code: 0,
        msg: 'success'
      }
    }
  } catch (error) {
    console.log(error)
  }
}
