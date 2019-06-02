<template>
<div>
  <div class="ccPage" >
    <div class="areaPic">
      <img :src="list.image" alt="图片" mode="aspectFit">
    </div>
    <div class="areaInfo">
      <div class="title">
        <span>{{list.name}}</span>
      </div>
      <div class="price">
        <span>单价：￥{{list.price}}</span>
      </div>
      <div class="number">
        <span>数量x5</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['list'],
  data () {
    return {
      productList: [
        {
          image: '/static/images/defaultphoto.png',
          name: 'a',
          price: '200',
          number: '5'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.ccPage {
  width: 98%;
  display: flex;
  justify-content: flex-start;
  align-self: center;
  margin-bottom: 20rpx;
}

.areaPic {
  margin-top: 20rpx;
  img{
    width: 200rpx;
    height: 150rpx;
  }
}

.areaInfo {
  width: 100%;
}

.title{
  width: 300rpx;
  font-size: 38rpx;
  margin-top: 20rpx;
  margin-left: 30rpx;
  overflow: hidden;
}

.price{
  color: red;
  width: 300rpx;
  margin-top: 10rpx;
  margin-left: 30rpx;
}

.number{
  font-size: 28rpx;
  color: rgb(197, 8, 8);
  margin-top: 10rpx;
  margin-left: 30rpx;
}
</style>
