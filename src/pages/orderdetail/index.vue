<template>
  <div>
    <div class="areAddress">
      <div class="areaLoction">
        <img src="/static/images/location.png" alt="定位" mode="aspectFit" class="loImg">
      </div>
      <div class="recMsg" v-for="(item, cIndex) in addressList" :key="cIndex">
        <div class="areaPeople">收货人：{{item.person}}</div>
        <div class="areaRecAd">收获地址:{{item.city}}</div>
      </div>
    </div>
    <div class="areaOrder" v-for="item in orderList" :key="item">
      <div class="areaFarm">
        <div class="nameFarm"><span>{{item.farm}}</span></div>
        <div class="tradeComp"><span>交易完成</span></div>
      </div>
      <div class="orderMsg">
        <div>
          <img :src="item.image" alt="图片" mode="aspcetFit" class="oImg">
        </div>
        <div class="msgName">{{item.name}}</div>
        <div class="msgPrice">￥{{item.price}}</div>
        <div id="count"><span>x1</span></div>
      </div>
    </div>
    <div class="optionContent" v-if="!userRating.length">
      <span @click="addComment">评价</span>
    </div>
    <div v-else class="showRate">
      <span v-for="item in userRating" :key="item">
        感谢评价，您给出的评分是{{item.rate}}分
      </span>
    </div>
    <div v-if="showComment">
      <div v-if="!userRating.length" class="areaRate">
        <slider @change="sliderchange" min="0" max="5" show-value block-size="25" class="rating"/>
        <span>您给出的评分是：{{rate}}分</span>
        <button class="btn" @click="ensureComment">提交评分</button>
      </div>
    </div>
    <div class="cartEmpty">
        <span>- 没有更多数据 -</span>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database()
export default {
  data () {
    return {
      orderId: '',
      userInfo: '',
      orderList: [],
      productDetail: [],
      addressId: '',
      addressList: [],
      rate: 0,
      userRating: [],
      showComment: false,
      ensureCommit: false
    }
  },
  methods: {
    async getOrderDetail () {
      const result = await db.collection('orders').where({
        _id: this.orderId
      }).get()
      if (result) {
        this.orderList = result.data.map(item => {
          return {
            name: item.order[0].name,
            farm: item.order[0].farm,
            price: item.order[0].price,
            image: item.order[0].image || item.order[0].imgurls,
            productInfo: item.order[0].productInfo,
            addressId: item.addressId
          }
        })
        this.addressId = this.orderList[0].addressId
      }
      this.productDetail = this.orderList.map(item => {
        return {
          pId: item.productInfo._id
        }
      })
    },
    async getAddress () {
      const result = await db.collection('address').where({
        _id: this.addressId
      }).get()
      if (result) {
        this.addressList = result.data
      }
    },
    addComment () {
      this.showComment = true
    },
    sliderchange (e) {
      this.ensureCommit = true
      this.rate = e.target.value
    },
    async ensureComment () {
      const result = await db.collection('comments').add({
        data: {
          rate: this.rate,
          pId: this.productDetail,
          orderId: this.orderId
        }
      }).then((value) => {
        wx.showModal({
          title: '评分成功',
          content: '评价已完成，谢谢',
          success (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/orders/main'
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/orders/main'
              })
            }
          }
        })
      })
      if (result) {
        this.showComment = false
      }
    },
    async getCommentResult () {
      const result = await db.collection('comments').where({
        orderId: this.orderId,
        _openid: this.userInfo.openid
      }).get()
      if (result) {
        this.userRating = result.data.map(item => {
          return {
            rate: item.rate
          }
        })
      }
    }
  },
  mounted () {
    const userinfo = wx.getStorageSync('userInfo')
    if (userinfo) {
      this.userInfo = userinfo
    }
    this.orderId = this.$root.$mp.query.id
    this.getOrderDetail()
    this.getCommentResult()
    const self = this
    setTimeout(function () {
      self.getAddress()
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.areAddress{
  width: 96%;
  margin: 5rpx auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.areaOrder{
  width: 96%;
  margin: 20rpx auto;
}

.areaLoction{
  height: 150rpx;
  width: 80rpx;
}

.areaFarm{
  display: flex;
  justify-content: space-between;
}

.areaRate{
  width: 96%;
  margin: 10rpx auto;
  span{
    margin-left: 40rpx;
    font-size: 32rpx;
    color: rgb(74, 124, 218)
  }
}

.showRate{
  width: 96%;
  margin: 20rpx auto;
  text-align: center;
  span{
    font-size: 32rpx;
    color: rgb(74, 124, 218)
  }
}

.loImg{
  width: 60rpx;
  height: 150rpx;
}

.recMsg{
  height: 150rpx;
  width: 500rpx;
  overflow: hidden;
}

.areaPeople{
  margin-top: 20rpx;
  font-size: 36rpx;
  overflow: hidden;
  color: rgb(173, 173, 172);
}

.areaRecAd{
  margin-top: 20rpx;
  font-size: 36rpx;
  overflow: hidden;
  color: rgb(173, 173, 172);
}

.oImg{
  margin-top: 10rpx;
  margin-left: 20rpx;
  width: 220rpx;
  height: 220rpx;
}

.msgName{
  margin-top: 10rpx;
  margin-left: 20rpx;
  width: 300rpx;
  height: 220rpx;
}

.msgPrice{
  margin-top: 80rpx;
  margin-left: 20rpx;
  width: 180rpx;
  height: 220rpx;
  color: red;
}

.orderMsg{
  margin-top: 50rpx;
  display: flex;
  justify-content: flex-start;
}

.nameFarm{
  color: green;
  font-size: 28rpx;
  padding-left: 20rpx;
}

.nameFarm span:nth-child(1)::after{
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

#count span:nth-child(1){
  position: relative;
  top: 120rpx;
  right: 30rpx;
  font-size: 28rpx;
  color: gray;
}

.cartEmpty{
    width: 98%;
    text-align: center;
    font-size: 34rpx;
    color: rgb(209, 209, 209);
    margin-top: 40rpx;
    margin-bottom: 20rpx;
}

.optionContent{
  width: 150rpx;
  position: absolute;
  top: 480rpx;
  right: 60rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 28rpx;
  color: red;
  border: 2rpx solid red;
  border-radius: 4rpx;
}

.rating{
  width: 92%;
  margin: 40rpx auto;
}

.btn{
  width: 90%;
  margin: 10rpx auto;
  background-color: red;
  color: white;
  line-height: 80rpx;
  align-items: center;
}

</style>
