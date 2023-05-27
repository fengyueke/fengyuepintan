<template>
  <div class="marketNav-container">
    <Navbar :title="$route.params.title"></Navbar>
    <van-grid ref="hotText" direction="horizontal" :column-num="4">
        <van-grid-item  text="综合" @click="hotTab(0)"/>
        <van-grid-item  text="销量" @click="hotTab(1)"/>
        <van-grid-item  :icon="icon" text="价格" @click="hotTab(2)"/>
        <van-grid-item  text="新品" @click="hotTab(3)"/>
      </van-grid>
      <div class="classify">
      <keep-alive>
        <component :is="comName" :title="$route.params.title" :list="list"></component>
      </keep-alive>
      </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar-vue.vue'
import ZongHe from '@/components/market/nav/rice/zongHe-vue.vue'
import Volume from '@/components/market/nav/rice/volume-vue.vue'
import Price from '@/components/market/nav/rice/price-vue.vue'
import Timer from '@/components/market/nav/rice/timer-vue.vue'

export default {
  data () {
    return {
      icon: 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png',
      comName: 'ZongHe',
      list: ['综合', '销量', '价格', '新品'],
      isDesc: false
    }
  },
  methods: {
    hotTab (id) {
      const t = this.$refs.hotText.$el.childNodes
      for (let i = 0; i < t.length; i++) {
        if (i === id) {
          t[i].childNodes[0].lastChild.style.color = '#FEA662'
        } else {
          t[i].childNodes[0].lastChild.style.color = '#646566'
        }
      }
      switch (id) {
        case 0:
          this.comName = 'ZongHe'
          break
        case 1:
          this.comName = 'Volume'
          break
        case 2:
          this.$store.commit('updateRiceIsDesc')
          if (this.icon === 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png') {
            this.icon = 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxceia.png'
          } else {
            this.icon = 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png'
          }
          this.comName = 'Price'
          break
        case 3:
          // console.log(4)
          this.comName = 'Timer'
          break
      }
    }
  },
  mounted () {
    this.$refs.hotText.$el.childNodes[0].childNodes[0].lastChild.style.color = '#FEA662'
  },
  components: {
    Navbar,
    ZongHe,
    Volume,
    Price,
    Timer
  }
}
</script>

<style lang="less" scoped>
  .marketNav-container{
    margin-top: 46px;
    min-height: 100vh;
    background: #f5f5f5;
    /deep/.van-grid-item__text{
      font-size: 15px;
    }
    /deep/.van-grid-item__icon{
      font-size: 16px;
    }
    .classify{
      margin: 10px 0;
      /deep/.van-grid-item__text{
      font-size: 12px;
    }
    /deep/ .van-grid-item__content{
      padding: 10px 6px;
    }
    }
  }
</style>
