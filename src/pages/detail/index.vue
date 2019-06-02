<template>
  <div class="pageDetail">
    <div :key="item" v-for="item in product">
      <div class="areaTop">
        <img :src="item.imgurls" alt="图片" mode="aspectFit">
          <div class="price">
            <span>￥{{item.price}}</span>
          </div>
          <div class="title">
            <span>{{item.name}}</span>
          </div>
          <div class="address">
            <div>
              <span>快递：{{item.express}}</span>
            </div>
            <div>
              <span>月销：{{item.people}}</span>
            </div>
            <div>
              <span>{{item.address}}</span>
            </div>
          </div>
      </div>
      <div class="areaFarm">
        <div>
          <span class="homeLand">产自</span>
        </div>
        <div>
          <span class="farm">{{item.farm}}</span>
        </div>
        <div>
          <span class="homeLand"></span>
        </div>
      </div>
      <div class="areaComment">
        <div class="commeTitle">
          <span>商品评论</span>
        </div>
        <div v-if="!commentList.length" class="comEmpty">
          <span>- 暂时没有评论 -</span>
        </div>
        <div v-else>
          <div :key="commIndex" v-for="(item, commIndex) in commentList">
            <span>{{item}}</span>
          </div>
        </div>
      </div>
      <div class="functionBar">
        <div>
          <button class="buyBtn" @click="addOrder">立即购买</button>
        </div>
        <div>
          <button class="addCart" @click="addCart">加入购物车</button>
        </div>
        <div>
          <div v-if="!addFav" @click="addFavorite">
            <img src="/static/images/favorite.png" alt="" class="favImg" mode="aspectFit">
          </div>
          <div v-else>
            <img src="/static/images/favorite-act.png" class="favImg" alt="" mode="aspectFit">
          </div>
          <div class="imgContent">
            <span>收藏</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database()
export default {
  data () {
    return {
      userInfo: '',
      listId: '',
      product: [],
      commentList: [],
      addressList: [],
      aId: '',
      addFav: false
    }
  },
  methods: {
    async getProduct () {
      const productList = await db.collection('products').where({
        _id: this.listId
      }).get()
      this.product = productList.data
      console.log('I\'m detail')
    },
    async addCart () {
      const add = await db.collection('cart').add({
        data: {
          productDetail: this.product,
          userInfo: this.userInfo
        }
      })
      if (add._id) {
        wx.showModal({
          title: '添加成功',
          content: '商品已添加至购物车',
          success (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/cart/main'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    async addFavorite () {
      const time = new Date().getTime()
      const result = await db.collection('favorite').add({
        data: {
          productDetail: this.product,
          createTime: time
        }
      })
      if (result._id) {
        const self = this
        setTimeout(wx.showToast({
          title: '收藏',
          icon: 'success',
          duration: 2000,
          complete: function (res) {
            self.addFav = true
          }
        }), 200)
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
    async addOrder () {
      console.log('Add orders begin')
      const orderList = this.product.map(item => {
        return {
          carId: '0',
          details: item
        }
      })
      console.log('商品信息', orderList)
      console.log('商品信息', this.product)
      const result = await db.collection('orders').add({
        data: {
          order: this.product,
          addressId: this.aId[0].aId
        }
      })
      if (result._id) {
        wx.showModal({
          title: '成功提交订单',
          content: '是否前往订单页面',
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
      }
    },
    async getFavorite () {
      const result = await db.collection('favorite').where({
        _openid: this.userInfo.openid,
        _id: this.listId
      }).get()
      if (result.data) {
        this.addFav = true
      }
    }
  },
  mounted () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.userInfo = userInfo
    }
    this.listId = this.$root.$mp.query.id
    this.getProduct()
    this.getFavorite()
    this.getAddress()
  }
}
</script>

<style lang="scss">
.pageDetail{
  background-color: rgb(246, 244, 244);
}

.areaTop{
  width: 100%;
  margin: 10rpx auto;
  background-color: white;
  img{
    width: 100%;
  }
}

.areaFarm{
  margin-top: 20rpx;
  padding-top: 20rpx;
  padding-bottom: 20rpx;
  display: flex;
  justify-content: space-around;
  background-color: white;
}

.areaComment{
  margin-top: 20rpx;
  background-color: white;
}

.functionBar{
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.price{
  padding-left: 50rpx;
  color: red;
  font-size: 45rpx;
}

.title{
  padding: 20rpx 30rpx;
  font-size: 40rpx;
  overflow: hidden;
}

.address{
  padding-left: 30rpx;
  font-size: 24rpx;
  display: flex;
  justify-content: space-between;
  color: rgb(141, 140, 140);
  span{
    padding-left: 10rpx;
    padding-right: 30rpx;
  }
}

.farm{
  color: green;
  font-size: 40rpx;
}

.homeLand{
  font-size: 22rpx;
  color: rgb(141, 140, 140);
}

.commeTitle{
  padding-top: 50rpx;
  margin-left: 60rpx;
  font-size: 28rpx;
}

.comEmpty{
    width: 98%;
    text-align: center;
    font-size: 24rpx;
    color: rgb(180, 175, 175);
    margin-top: 60rpx;
    margin-bottom: 20rpx;
}

.buyBtn{
  width: 250rpx;
  height: 80rpx;
  background-color: red;
  color: white;
  font-size: 30rpx;
  border-radius: 0;
}

.addCart{
  width: 250rpx;
  height: 80rpx;
  background-color: rgb(247, 181, 17);
  color: white;
  font-size: 30rpx;
  border-radius: 0;
}

.favImg{
  width: 50rpx;
  height: 50rpx;
  margin-right: 30rpx;
}

.imgContent{
  text-align: center;
  font-size: 18rpx;
  margin-right: 30rpx;
}
</style>

