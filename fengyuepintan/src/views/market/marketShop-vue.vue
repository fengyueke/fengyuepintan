<template>
  <div class="marketShop-container">
    <div class="navbar">
      <van-nav-bar title="店铺详情"  @click-left="$router.back()" >
      <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
      <template #right>
        <van-icon name="share-o" size="25" @click="showShare = true" />
      </template>
    </van-nav-bar>
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      />
    </div>
    <div class="shopInfo">
      <div class="detail">
        <div>{{shopInfo.name}}</div>
        <div><img :src="shopInfo.logo" alt=""></div>
        <div>发货地：{{ shopInfo.address }}</div>
        <div>开张日期：{{ shopInfo.creation }}</div>
      </div>
      <div class="contact">
        <van-grid direction="horizontal" :column-num="2">
          <van-grid-item icon="chat-o" text="在线联系" class="line" />
          <van-grid-item icon="phone-o" text="联系商家" @click="$dialog.alert({title: '商家手机号',message: shopInfo.phone,theme: 'round-button',})" />
        </van-grid>
      </div>
    </div>
    <div class="list">
      <van-grid ref="hotText" direction="horizontal" :column-num="4">
        <van-grid-item  text="综合" @click="hotTab(0)"/>
        <van-grid-item  text="销量" @click="hotTab(1)"/>
        <van-grid-item  :icon="icon" text="价格" @click="hotTab(2)"/>
        <van-grid-item  text="新品" @click="hotTab(3)"/>
      </van-grid>
      <div class="classify">
      <keep-alive>
        <component :is="comName" ></component>
      </keep-alive>
    </div>
  </div>
  </div>
</template>

<script>
import ZongHe from '@/components/market/shopStoke/zongHe-vue.vue'
import Volume from '@/components/market/shopStoke/Volume-vue.vue'
import Price from '@/components/market/shopStoke/price-vue.vue'
import Timer from '@/components/market/shopStoke/timer-vue.vue'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      showShare: false,
      shareOptions: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ],
      icon: 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png',
      comName: 'ZongHe',
      list: ['综合', '销量', '价格', '新品'],
      isDesc: false,
      shopInfo: []
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
          this.$store.commit('updateIsDesc')
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
    },
    async getShop () {
      const { data: res } = await this.$http.get('/my/getMarketShop', { params: { id: this.$route.params.id } })
      if (res.status === 200) {
        res.data.creation = dayjs(res.data.creation).format('YYYY-MM-DD')
        this.shopInfo = res.data
        console.log(this.shopInfo)
      }
    }
  },
  created () {
    this.getShop()
  },
  mounted () {
    this.$refs.hotText.$el.childNodes[0].childNodes[0].lastChild.style.color = '#FEA662'
  },
  components: {
    ZongHe,
    Volume,
    Price,
    Timer
  }

}
</script>

<style lang="less" scoped>
.marketShop-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  .navbar{
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
  .shopInfo{
    background: #fff;
    .detail{
      padding-top: 10px;
      div{
        margin: 5px 0;
        color: #666666;
        font-size: 12px;
      }
      text-align: center;
      :nth-child(1){
        font-size: 14px;
        color: #333;
      }
      :nth-child(2){
        img{
          width: 50px;
          border-radius: 50%;
        }
      }
    }
    .contact{
      /deep/.van-grid-item__text{
        font-size: 16px;
      }
      /deep/.van-grid-item__text{
        color: #666;
      }
      /deep/.van-grid-item{
        border-top: 1px solid #ccc;
      }
      .line{
        border-right: 1px solid #ccc;
      }
    }
  }
  .list{
    margin-top: 20px;
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
}
</style>
