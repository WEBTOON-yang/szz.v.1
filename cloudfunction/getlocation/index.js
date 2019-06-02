// 云函数入口文件
const cloud = require('wx-server-sdk')
// const axios = require('axios')

cloud.init()

async function getCity (loc) {
  // const ak = 'RtMQsFIuGmyWZ3iSFX8KRHeb6IpW07UO'
  // const url = 'http://api.map.baidu.com/api?v=3.0'
  // const cityDetail = await axios.get(`${url}`, {
  //   params: {
  //     loc,
  //     output: 'json',
  //     ak
  //   }
  // })
  // return cityDetail
}

// 云函数入口函数
exports.main = async (event, context) => {
  const {location} = event
  if (location) {
    return getCity(location)
  } else {
    return {
      code: -1,
      msg: 'faill'
    }
  }
}
