<template>
  <div>
    <div class="orderEmpty" v-if="!orderList.length">
      <span>- 暂无订单数据 -</span>
    </div>
    <div class="order" v-else>
      <order-card :list="orderListShow"></order-card>
      <div class="listEmpty">
        <span>- 没有更多数据 -</span>
      </div>
    </div>
  </div>
</template>

<script>
import OrderCard from '@/components/OrderCard'
const db = wx.cloud.database()
export default {
  components: {
    OrderCard
  },
  data () {
    return {
      orderList: ['a'],
      orderListShow: [],
      userInfo: ''
    }
  },
  methods: {
    async getOrderList () {
      const result = await db.collection('orders').where({
        _openid: this.userInfo.openid
      }).get()
      this.orderList = result.data.map(item => {
        return {
          list: item.order,
          id: item._id
        }
      })
      this.orderListShow = this.orderList.map(item => {
        return {
          name: item.list[0].name,
          image: item.list[0].image || item.list[0].imgurls,
          price: item.list[0].price,
          farm: item.list[0].farm,
          piece: item.list.length,
          id: item.id
        }
      })
    }
  },
  mounted () {
    const userinfo = wx.getStorageSync('userInfo')
    if (userinfo) {
      this.userInfo = userinfo
    }
    this.getOrderList()
  },
  onPullDownRefresh () {
    wx.showNavigationBarLoading()
    this.getOrderList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }
}
</script>

<style>
body{
  background-color: rgb(248, 248, 248);
}

.orderEmpty{
    width: 98%;
    text-align: center;
    font-size: 24rpx;
    color: rgb(209, 209, 209);
    margin-top: 20rpx;
    margin-bottom: 20rpx;
}

.order{
  width: 98%;
  margin: 10rpx auto;
}

.listEmpty{
  width: 98%;
  text-align: center;
  font-size: 24rpx;
  color: rgb(209, 209, 209);
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
</style>

