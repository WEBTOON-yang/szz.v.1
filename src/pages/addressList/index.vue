<template>
  <div>
    <div v-for="item in addressList" :key="item">
      <address-card  :list="item"></address-card>
    </div>
  </div>
</template>

<script>
import AddressCard from '@/components/AddressCard'
const db = wx.cloud.database()
export default {
  components: {
    AddressCard
  },
  data () {
    return {
      userInfo: '',
      addressList: ''
    }
  },
  methods: {
    async getAddressList () {
      const result = await db.collection('address').where({
        _openid: this.userInfo.openid
      }).get()
      if (result) {
        this.addressList = result.data
        console.log('adLIst is', this.addressList)
      }
    }
  },
  mounted () {
    const userinfo = wx.getStorageSync('userInfo')
    if (userinfo) {
      this.userInfo = userinfo
    }
    this.getAddressList()
  }
}
</script>

<style lang="scss" scoped>
body{
  background-color: rgb(218, 218, 216);
}
</style>
