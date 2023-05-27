<template>
  <div v-if="banner.length" class="swiper-container">
    <div class="swiper-wrapper">
      <div v-for="(item) in banner" :key="item" class="swiper-slide"><img :src="item" alt=""></div>
    </div>
    <div class="skip" @click="jump">{{ $store.state.swiper }}&nbsp;&nbsp;跳过</div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import '../../../node_modules/swiper/css/swiper.min.css'
import guide1 from '@/assets/img/guide1.png'
import guide2 from '@/assets/img/guide2.png'
import guide3 from '@/assets/img/guide3.png'

export default {
  name: 'swiperGuide',
  data () {
    return {
      banner: [guide1, guide2, guide3]
    }
  },
  methods: {
    jump () {
      this.$store.commit('swiperZero')
    }
  },
  created () {
    this.$store.commit('swiperTime')
  },
  mounted () {
    /* eslint-disable */ 
    new Swiper('.swiper-container', {
      // direction: 'vertical', // 垂直切换选项
      // loop: true, // 循环模式选项

      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination'
      },

      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },

      // 如果需要滚动条
      scrollbar: {
        el: '.swiper-scrollbar'
      },
      effect: 'cards',
      autoplay: {
        delay: 1000,//1秒切换一次
        stopOnLastSlide: true,
        disableOnInteraction: false,
      },
    })
  }
}
</script>

<style lang="less" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  img{
    width: 100%;
  }
  .skip{
    font-size: 12px;
    width: 50px;
    text-align: center;
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 1;
    color: #fff;
    height: 30px;
    line-height: 30px;
    border: 1px solid pink;
    border-radius: 14px;
  }
}
</style>
