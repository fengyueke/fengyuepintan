<template>
  <div class="deal-container">
  <Navbar :title="title"></Navbar>
  </div>
</template>

<script>
import Navbar from '../Navbar-vue.vue'

export default {
  data () {
    return {
      title: '确认订单'
    }
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
  .deal-container{}
</style>
