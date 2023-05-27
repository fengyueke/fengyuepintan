<template>
  <div class="setUser-container">
    <Navbar :title="title"></Navbar>
    <van-cell-group inset>
      <van-cell title="手机号" to="/setphone"  is-link />
      <van-cell title="密码" to="/setpwd" is-link />
      <van-cell title="基本信息" to="/sethp" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar-vue.vue'
export default {
  data () {
    return {
      title: '个人信息设置',
      phone: ''
    }
  },
  methods: {

  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
.setUser-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-cell{
    border-bottom: 5px solid #f5f5f5;
  }
  /deep/.van-cell__left-icon, .van-cell__right-icon{
    font-size: 25px;
  }
}
</style>
