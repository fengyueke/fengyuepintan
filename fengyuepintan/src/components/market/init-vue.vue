<template>
  <div class="zongHe-container">
    <div class="box" v-for="item in zList" :key="item.id">
      <div class="content">
        <div class="banner"><img :src="item.banner" alt=""></div>
        <div class="text">
          <div class="title">{{ item.title }}</div>
          <div class="price">￥ {{ item.price }}</div>
          <div class="cart">{{item.volume}}人已购买</div>
        </div>
      </div>

    </div>

</div>
</template>

<script>
export default {
  props: ['zList'],
  data () {
    return {
      isShow: false
    }
  }

}
</script>

<style lang="less" scoped>
.zongHe-container{
  background: #f5f5f5;
  .box{
    margin-top: 10px;
    width: 50%;
    display: inline-block;
    background: #f5f5f5;
    .content{
      box-sizing: border-box;
      padding: 10px;
      font-size: 12px;
      width: 95%;
      position: relative;
      background: #fff;
      left: 50%;
      transform: translate(-50%,0);
      .banner{
        text-align: center;
        img{
          width: 100%;
        }
      }
      .text{
        .title{
          margin: 3px 0;
        }
        .price{
          margin: 3px 0;
          font-size: 14px;
          color: #FD984C;
        }
        .cart{
          color: #A5A5A5;
        }
      }
    }
  }
}
</style>
