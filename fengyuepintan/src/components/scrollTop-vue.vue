<template>
  <div class="scroll-container">
    <nav v-show="showTop">
        <img src="http://localhost/app/thumb.php?img=/i/2023/05/04/j49htv.png" @click="Top" alt="">
      </nav>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showTop: false
    }
  },
  methods: {
    Top () {
      // 获取当前滚动条的位置
      let top = document.documentElement.scrollTop || document.body.scrollTop
      // 滚动动画
      const timeTop = setInterval(() => {
        document.body.scrollTop =
          document.documentElement.scrollTop =
          top -=
            50
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    },
    // 监听事件
    scrolling () {
      const current =
        document.documentElement.scrollTop || document.body.scrollTop
      const vh = window.innerHeight
      if (current >= vh) {
        this.showTop = true
      } else {
        this.showTop = false
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrolling)
  }
}
</script>

<style lang="less" scoped>
.scroll-container{
  nav{
    position: fixed;
    bottom: 20%;
    right: 5%;
    img{
      width: 50px;
      border-radius: 50%;
    }
  }
}
</style>
