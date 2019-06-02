<template>
  <div>
    <div class="useMsg">
      <img src="/static/images/bacImg.jpg" alt="backgroundPicture" class="back">
      <div  v-if="userInfo.nickName">
        <img :src="userInfo.avatarUrl" class="uImg">
        <span class="uName">{{ userInfo.nickName }}</span>
      </div>
      <div v-else>
        <img src="/static/images/user.png" class="uImg">
        <button @getuserinfo="onGetUserinfo" open-type="getUserInfo" class="btn">登录</button>
      </div>
    </div>
    <div class="funcList">
      <div class="box" v-for="navIcon in navIcons" :key="navIcon" @click="naviTo(navIcon)">
        <div class="funcIcon">
          <img :src="navIcon.url" class="boxIcon">
        </div>
        <div class="funcTitle">
          {{ navIcon.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {

  },
  data () {
    return {
      userInfo: wx.getStorageSync('userInfo') || {},
      navIcons: [{
        url: '/static/images/address.png',
        title: '收货地址',
        pageUrl: '/pages/addressList/main'
      }, {
        url: '/static/images/comment.png',
        title: '新增地址',
        pageUrl: '/pages/addresset/main'
      }, {
        url: '/static/images/describe.png',
        title: '使用说明',
        pageUrl: ''
      }, {
        url: '/static/images/more.png',
        title: '未完待续',
        pageUrl: ''
      }]
    }
  },
  created () {
    console.log('I \'m ready')
  },
  methods: {
    onGetUserinfo (e) {
      let userInfo = e.mp.detail.userInfo
      wx.cloud.callFunction({
        name: 'login',
        complete: (res) => {
          userInfo.openid = res.result.openid
          this.userInfo = userInfo
          wx.setStorageSync('userInfo', userInfo)
        }
      })
    },
    naviTo (item) {
      wx.navigateTo({
        url: item.pageUrl
      })
    }
  }
}
</script>

<style lang="scss">
.userMsg{
    width: 750rpx;
    height: 480rpx;
    position: relative;
}

.back{
    filter: blur(5px);
    width: 750rpx;
    height: 450rpx;
}

.uImg{
    position: absolute;
    width: 160rpx;
    height: 160rpx;
    border: 4rpx solid white;
    border-radius: 50%;
    top: 110rpx;
    left: 290rpx;
}

.uName{
    position: absolute;
    width: 200rpx;
    text-align: center;
    overflow: hidden;
    color: whitesmoke;
    top: 300rpx;
    left: 275rpx;
}

.btn{
    position: absolute;
    top: 320rpx;
    left: 195rpx;
    width: 360rpx;
    background-color: green;
    color: white;
    font-size: 32rpx;
}

.funcList{
    width: 744rpx;
    height: 345rpx;
    background-color: white;
    margin-top: 200rpx;
    margin: 30rpx auto;
}

.box{
    margin-top: 55rpx;
    margin-left: 50rpx;
    width: 120rpx;
    text-align: center;
    float: left;
}

.boxIcon{
    width: 85rpx;
    height: 85rpx;
    border-radius: 50%;
}

.funcTitle{
    font-size: 28rpx;
}

</style>
