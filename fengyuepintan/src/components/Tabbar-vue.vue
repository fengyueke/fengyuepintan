<template>
  <div class="tabbar-container">
    <van-tabbar v-if="!$store.state.swiper"  ref="tabber">
    <!-- <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="shop-o" to="/market">集市</van-tabbar-item>
    <van-tabbar-item icon="http://localhost/i/2023/04/01/lj91e4.png">社区</van-tabbar-item>
    <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item> -->
    <van-tabbar-item v-for="(item,index) in icon" :key="index" :icon="item" @click="toPage(index)">{{ title[index] }}</van-tabbar-item>
  </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: ['home-o', 'shop-o', 'http://localhost/i/2023/04/01/lj91e4.png', 'user-o'],
      title: ['首页', '集市', '社区', '我的']
    }
  },
  methods: {
    toPage (index) {
      const t = this.$refs.tabber.$el.childNodes
      for (let i = 0; i < t.length; i++) {
        if (index === i) {
          t[i].setAttribute('class', 'van-tabbar-item van-tabbar-item--active')
        } else {
          t[i].setAttribute('class', 'van-tabbar-item')
        }
      }
      switch (index) {
        case 0:
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
          break
        case 1:
          if (this.$route.path !== '/market') {
            this.$router.push('/market')
          }
          break
        case 2:
          if (this.$route.path !== '/dynamic') {
            this.$router.push('/dynamic')
          }
          break
        case 3:
          if (this.$route.path !== '/user') {
            this.$router.push('/user')
          }
          break
      }
    }
  }

}
</script>
<style lang="less" scoped>
  .tabbar-container{
    /deep/.van-tabbar-item--active{
    color: #ffdd00;
  }
  }
</style>
