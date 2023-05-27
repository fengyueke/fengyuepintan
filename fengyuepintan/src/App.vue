<template>
  <div class="app-container">
    <!-- 轮播图 -->
    <Swiper v-if="$store.state.swiper"></Swiper>

      <!-- 路由占位符 -->
      <router-view v-else></router-view>
      <Tabbar v-if="$route.path==='/'||$route.path==='/market'||$route.path==='/user'||$route.path==='/dynamic'"></Tabbar>
  </div>
</template>

<script>
import Swiper from '@/components/swiper/swiper-vue.vue'
import Tabbar from './components/Tabbar-vue.vue'

export default {
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    Swiper,
    Tabbar
  }
}
</script>

<style lang="less" scoped>
.app-container{

}
</style>
