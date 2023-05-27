<template>
  <div class="navbar-container">
    <van-nav-bar :title="title"  @click-left="$router.back()" >
      <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script>

export default {
  props: ['title']
}
</script>

<style lang="less" scoped>
  .navbar-container{
    z-index: 999;
    position: fixed;
    width: 100%;
    top: 0;
    /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  }
</style>
