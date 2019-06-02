<template>
  <div>
    <div class="proArea">
      <div class="cartEmpty" v-if="!productList.length">
        <span>- 购物车为空 -</span>
      </div>
      <div v-else>
        <div v-for="item in productList" :key="item">
          <div class="itemCard">
            <checkbox @click="choiceBox(item)" class="ckBox" :checked="item.checked" /><cart-card :list='item'></cart-card>
          </div>
        </div>
        <div class="cartEmpty" v-if="!more">
          <span>- 没有更多数据 -</span>
        </div>
      </div>
    </div>
    <div class="operArea">
      <div class="fullPic"><checkbox class="ckBox" @click="fullPick" :checked="fullPicker"/><span>全选</span></div>
      <div><span class="totalCount">总金额:<span class="totalMoney">￥{{totalPrice}}</span></span></div>
      <div><button class="orderBtn" @click="addOrder">结算</button></div>
    </div>
  </div>
</template>

<script>
import CartCard from '@/components/CartCard'
const db = wx.cloud.database()
export default {
  components: {
    CartCard
  },
  data () {
    return {
      userInfo: '',
      productList: [],
      orderList: [],
      aId: '',
      more: false,
      checked: false,
      insertOrder: false,
      fullPicker: false
    }
  },
  computed: {
    totalPrice () {
      let totalMoney = 0
      this.productList.forEach(item => {
        if (item.checked && item.insertOrder) {
          totalMoney += item.price
        }
      })
      return totalMoney
    }
  },
  mounted () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.userInfo = userInfo
    }
    this.getCartList()
    this.getAddress()
  },
  methods: {
    async getCartList () {
      const products = await db.collection('cart').where({
        _openid: this.userInfo.openid
      }).get()
      this.productList = products.data.map(item => {
        return {
          id: item._id,
          name: item.productDetail[0].name,
          image: item.productDetail[0].imgurls,
          price: item.productDetail[0].price,
          farm: item.productDetail[0].farm,
          productInfo: item.productDetail[0],
          checked: false,
          insertOrder: false
        }
      })
    },
    async releseCart () {
      wx.cloud.callFunction({
        name: 'cartrelese',
        data: {
          cartId: this.orderList.cartId,
          openid: this.userInfo.openid
        },
        complete: (res) => {
          console.log('success')
        }
      })
      this.fullPicker = false
    },
    async addOrder () {
      this.orderList = this.productList.filter(item => item.checked && item.insertOrder).map(item => {
        return {
          cartId: item.id,
          name: item.productInfo.name,
          details: item.productInfo,
          addressList: ''
        }
      })
      const orders = await db.collection('orders').add({
        data: {
          order: this.productList,
          addressId: this.aId[0].aId
        }
      })
      if (orders._id) {
        wx.showModal({
          title: '下单成功',
          content: '是否查看订单',
          success (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/orders/main'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        this.releseCart()
        this.getCartList()
      }
    },
    async getAddress () {
      const result = await db.collection('address').where({
        _openid: this.userInfo.openid
      }).orderBy('time', 'desc').limit(1).get()
      if (result) {
        this.addressList = result.data
        this.aId = this.addressList.map(item => {
          return {
            aId: item._id
          }
        })
      }
    },
    choiceBox (e) {
      let i = 0
      if (e.checked === false && e.insertOrder === false) {
        e.checked = true
        e.insertOrder = true
        this.productList.forEach(item => {
          if (item.checked === true) {
            i++
          }
          if (i === this.productList.length) {
            this.fullPicker = true
          }
        })
      } else if (e.checked === true && e.insertOrder === true) {
        e.checked = false
        e.insertOrder = false
        this.fullPicker = false
      }
    },
    fullPick () {
      if (!this.fullPicker) {
        this.fullPicker = true
        this.productList.forEach(item => {
          if (!item.checked && !item.insertOrder) {
            item.checked = true
            item.insertOrder = true
          }
        })
      } else {
        this.fullPicker = false
        this.productList.forEach(item => {
          if (item.checked && item.insertOrder) {
            item.checked = false
            item.insertOrder = false
          }
        })
      }
    }
  },
  onPullDownRefresh () {
    wx.showNavigationBarLoading()
    this.getCartList()
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  }
}
</script>

<style lang="scss">
body{
  background-color: rgb(248, 248, 248);
}

.ckBox{
  margin-left: 30rpx;
}

.cartEmpty{
    width: 98%;
    text-align: center;
    font-size: 34rpx;
    color: rgb(209, 209, 209);
    margin-top: 40rpx;
    margin-bottom: 20rpx;
}

.itemCard{
  width: 730rpx;
  margin-left: 10rpx;
  margin-top: 20rpx;
  background-color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.operArea{
  background-color: antiquewhite;
  z-index: 999;
  width: 98%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  bottom: 0rpx;
  font-size: 32rpx;
}

.totalCount{
  margin-right: 10rpx;
}

.totalMoney{
  color: red;
}

.orderBtn{
  background-color: red;
  color: white;
  width: 180rpx;
  font-size: 28rpx;
}

.fullPic{
  position: fixed;
  left: 50rpx;
  span{
    margin-left: 20rpx;
  }
}
</style>

