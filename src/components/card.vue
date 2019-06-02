<template>
  <div class="areaCard">
    <div class="productCard">
      <div class="areaPic">
        <img
          :src="list.imgurls"
          alt="图片"
          mode="aspectFit"
          class="pImg"
          @click="toDetail"
        >
      </div>
      <div class="pMsg">
        <div class="pTitle">
          <span>{{ list.name }}</span>
        </div>
        <div class="pRice">
          <span>￥：{{ list.price }}</span>
        </div>
        <div class="pFarm">
          <span>产地：{{ list.farm }}</span>
        </div>
      </div>
      <div class="areaCount">
        <span>{{ list.count }}人浏览</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data () {
    return {

    }
  },
  methods: {
    toDetail () {
      wx.navigateTo({
        url: '/pages/detail/main?id=' + this.list._id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
a:active{
  background-color: none;
}

.areaCard {
  width: 700rpx;
  margin: 20rpx auto;
  align-items: center;
}
.productCard {
  width: 700rpx;
  display: flex;
  flex-direction: row;
}

.areaPic {
  margin: 5rpx 20rpx;
}

.pImg {
  width: 200rpx;
  height: 200rpx;
}

.pMsg {
  width: 300rpx;
  display: block;
  overflow: hidden;
}

.pTitle{
  margin: 10rpx;
  font-size: 40rpx;
}

.pRice{
  margin: auto 20rpx;
  font-size: 38rpx;
  color: red;
}

.pFarm{
  margin-top: 20rpx;
  margin-left: 20rpx;
  font-size: 24rpx;
}

.areaCount{
  margin: 20rpx auto;
  font-size: 22rpx;
  color: rgb(209, 209, 209);
}
</style>
