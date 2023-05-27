<template>
  <div class="indent-container">
    <Navbar :title="title"></Navbar>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar-vue.vue'

export default {
  data () {
    return {
      title: '我的订单'
    }
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
  .indent-container{
  }
</style>
