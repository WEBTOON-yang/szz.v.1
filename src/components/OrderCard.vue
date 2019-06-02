<template>
  <div class="areaCard">
    <div v-for="item in list" :key="item._id" class="partCard">
      <div class="title">
        <div class="farmName"><span>{{item.farm}}</span></div>
        <div class="tradeComp"><span>交易成功</span></div>
      </div>
      <div class="ordInfo">
        <div class="ordInfo-img">
          <img :src="item.image" alt="" mode="aspectFit">
        </div>
        <div class="ordInfo-name">
          <div><span>{{item.name}}</span></div>
        </div>
        <div class="ordInfo-price">
          <div><span>￥{{item.price}}</span></div>
          <div id="count"><span>x{{item.piece}}</span></div>
        </div>
      </div>
      <div class="ordOption">
        <div class="optionContent">
          <span @click="showOrderDetail(item.id)">查看详情</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    showOrderDetail (e) {
      wx.navigateTo({
        url: '/pages/orderdetail/main?id=' + e
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.partCard{
  background-color: white;
  margin-top: 20rpx;
}

.title{
  width: 700rpx;
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  padding-top: 20rpx;
  padding-left: 20rpx;
}

.farmName{
  color: green;
  font-size: 28rpx;
  padding-left: 20rpx;
}

.farmName span:nth-child(1)::after{
  content: "";
  width: 15rpx;
  height: 15rpx;
  margin-left: 50rpx;
  border-top: 4rpx solid rgb(65, 64, 64);
  border-right: 4rpx solid rgb(65, 64, 64);
  display: inline-block;
  flex-wrap: wrap;
  transform: rotate(45deg)
}

.tradeComp{
  color: red;
  font-size: 28rpx;
  padding-right: 10rpx;
}

.ordInfo{
  width: 98%;
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  margin-left: 2%;
  align-items: center;
}

.ordInfo-img{
  width: 250rpx;
  height: 180rpx;
  margin-left: 20rpx;
  img{
    width: 250rpx;
    height: 180rpx;
  }
}

.ordInfo-name{
  font-size: 32rpx;
  width: 300rpx;
  height: 180rpx;
  float: left;
  overflow: hidden;
  padding-top: 30rpx;
}

.ordInfo-price{
  width: 100rpx;
  height: 180rpx;
  padding-top: 30rpx;
}

.ordInfo-price span:nth-child(1){
  color: red;
  font-size: 36rpx;
}

#count span:nth-child(1){
  padding-right: 40rpx;
  float: right;
  font-size: 28rpx;
  color: gray;
}

.ordOption{
  width: 98%;
  display: flex;
  justify-content: flex-end;
  margin-left: 1%;
  margin-top: 20rpx;
  padding-bottom: 20rpx;
  margin-bottom: 10rpx;
}

.optionContent{
  width: 150rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 28rpx;
  color: black;
  border: 2rpx solid gray;
  border-radius: 4rpx;
  margin-right: 30rpx;
}
</style>
