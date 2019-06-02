<template>
  <div>
    <div class="searchBar">
      <icon type="search" size="20" class="searIcon"></icon>
      <input type="text" v-model="searInput" class="searchInput" placeholder="搜索商品">
      <button class="searbtn" @click="focusBtn">搜索</button>
    </div>
    <div class="swiperBar">
      <top-swiper :tops="tops" />
    </div>
    <div class="productsList">
      <card :key="item.id" v-for="item in productList" :list='item'></card>
    </div>
  </div>
</template>

<script>
import TopSwiper from '@/components/TopSwiper'
import Card from '@/components/Card'
const db = wx.cloud.database()
export default {
  components: {
    TopSwiper,
    Card
  },
  data () {
    return {
      tops: [],
      productList: []
    }
  },
  methods: {
    async getSwiper () {
      const topList = await db.collection('products').orderBy('count', 'desc').get()
      this.tops = topList.data.filter(item => item.imgurls).map(item => {
        return {
          image: item.imgurls
        }
      })
    },
    async getProducts () {
      const productList = await db.collection('products').get()
      this.productList = productList.data.filter(item => item.imgurls)
    }
  },
  created () {
    this.getSwiper()
    this.getProducts()
  }
}
</script>

<style lang="scss">
.searchBar{
  background-color: white;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-between;
  z-index: 999;
}

.searIcon{
  padding-left: 20rpx;
  padding-top: 10rpx;
}

.searchInput{
  margin-left: 25rpx;
  width: 500rpx;
  border: 2rpx solid gainsboro;
  border-radius: 5rpx;
  font-size: 26rpx;
}

.searbtn{
  width: 100rpx;
  margin-left: 25rpx;
  font-size: 22rpx;
  color: white;
  background-color: rgb(74,124,218);
}

.swiperBar{
  width: 700rpx;
  position: absolute;
  top: 70rpx;
  left: 25rpx;
}

.productsList{
  position: relative;
  width: 700rpx;
  height: 200rpx;
  top: 380rpx;
  left: 25rpx;
}
</style>
