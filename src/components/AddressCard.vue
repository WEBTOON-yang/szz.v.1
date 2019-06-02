<template>
  <div>
    <div class="areaAddress" >
      <div class="areaImg">
        <img src="/static/images/location-card.png" alt="" class="aImg" mode="aspecFit">
      </div>
      <div class="areaInfo">
        <div>收件人：{{list.person}}</div>
        <div>地址：{{list.city}}</div>
        <div>电话：{{list.tel}}</div>
      </div>
      <div class="optionContent">
        <span @click="setDefault">设为默认</span>
      </div>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database()
export default {
  props: ['list'],
  data () {
    return {
      userInfo: ''
    }
  },
  methods: {
    async setDefault () {
      const time = new Date().getTime()
      const _id = this.list._id
      console.log(_id)
      const result = await db.collection('address').doc(_id).update({
        data: {
          time: time
        }
      })
      if (result) {
        console.log('resutl-updta', result)
      }
      console.log('ok')
    }
  },
  mounted () {
    const userinfo = wx.getStorageSync('userInfo')
    if (userinfo) {
      this.userInfo = userinfo
    }
    console.log(this.list)
  }
}
</script>

<style lang="scss" scoped>
body{
  background-color: white;
}

.areaAddress{
  width: 90%;
  margin: 30rpx auto;
  display: flex;
  justify-content: flex-start;
}

.areaInfo{
  margin: 20rpx 20rpx;
  width: 500rpx;
  font-size: 30rpx;
  color: rgb(74, 124, 218);
}

.areaImg{
  width: 150rpx;
  height: 150rpx;
}

.aImg{
  width: 150rpx;
  height: 150rpx;
}

.optionContent{
  position: relative;
  top: 40rpx;
  right: 20rpx;
  width: 150rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 28rpx;
  color: red;
  border: 2rpx solid red;
  border-radius: 4rpx;
}
</style>
