<template>
  <div class="recArea">
    <div class="recFont">
      <div class="people">收货人：<input type="text" v-model="person"></div>
      <div class="city">
        所在市：<input type="text" v-model="city" v-if="!useCurCity">
        <div v-else class="curCity"><span v-for="item in location" :key="item">{{item}}</span></div>
      </div>
      <div class="tel">联系电话：<input type="text" v-model="tel"></div>
      <div class="position"><span>使用当前城市？</span><switch :checked='location' @change="getLocation"></switch></div>
      <div class="areaBtn">
        <button class="btn" @click="addAddress">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database()
export default {
  data () {
    return {
      location: '',
      useCurCity: false
    }
  },
  methods: {
    getLocation (e) {
      this.useCurCity = true
      let url = 'https://api.map.baidu.com/geocoder/v2/'
      const ak = 'TgpmTvpclTz6LmOCSFser2OWBjVKEOcv'
      if (e.target.value) {
        wx.getLocation({
          success: loc => {
            console.log('-------------', loc)
            wx.request({
              url,
              data: {
                location: `${loc.latitude},${loc.longitude}`,
                output: 'json',
                ak
              },
              success: res => {
                console.log('RES:', res)
                if (res.data.status === 0) {
                  this.location = res.data.result.addressComponent.city
                  console.log('city:', this.location)
                } else {
                  this.location = '未知地点'
                }
              }
            })
            console.log('city:', this.location)
          }
        })
      } else {
        this.location = ''
      }
    },
    async addAddress () {
      const result = await db.collection('address').add({
        data: {
          person: this.person,
          city: this.city || this.location,
          tel: this.tel
        }
      })
      if (result) {
        wx.navigateTo({
          url: '/pages/addressList/main'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.recFont{
  width: 90%;
  margin: 10rpx auto;
  font-size: 32rpx;
  input{
    margin-top: 30rpx;
    margin-left: 10rpx;
    line-height: 80rpx;
    border: 2rpx solid gray;
    width: 660rpx;
  }
}

.people{
  margin: 10rpx 10rpx;
}

.city{
  margin: 20rpx 10rpx;
}

.tel{
  margin: 5rpx 10rpx;
}

.position{
  font-size: 30rpx;
  margin-top: 50rpx;
  margin-left: 20rpx;
}

.btn{
  background-color: rgb(74, 124, 218);
  color: white;
  width: 96%;
}

.areaBtn{
  margin: 30rpx
}

.curCity{
  margin: 20rpx;
  color: rgb(74, 124, 218);
}
</style>
