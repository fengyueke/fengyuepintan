<template>
  <div class="market-container">
    <form>
      <van-search
      v-model="value"
      show-action
      shape="round"
      placeholder="搜索食材、餐具"
      @search="onSearch"
      @cancel="onCancel"
      >
      <template #action>
        <div @click="onSearch"><van-icon name="shopping-cart-o" /></div>
      </template>
      </van-search>
    </form>
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="item in list" :key="item.id" @click="toDetails($event,item.id)">
        <img v-lazy="item.banner" class="banner" />
        <div class="swiper">
          <div class="title">{{ item.title }}</div>
          <div class="tart">{{ item.trait }}</div>
          <div class="tips">点击进入</div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <van-grid :column-num="3">
      <van-grid-item v-for="(item,index) in nav" :key="index" :icon="item.icon" :text="item.title" @click="toPage(index,item.title)" />
    </van-grid>
    <div class="limitTimer">
      <div class="top">
        <span class="title">限时抢购</span>
        <span class="timer">距离本场结束还有
          <van-count-down :time="time">
            <template #default="timeData">
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </span>
      </div>
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <div class="box">
            <div class="content" v-for="item in oneList" :key="item.id">
              <div class="banner">
                <img :src="item.banner" alt="">
              </div>
              <span class="title">{{ item.title }}</span>
              <div class="newPrice">￥ {{ item.newprice }}</div>
              <div class="oldPrice"><del>￥ {{ item.oldprice }}</del></div>
              <div class="residue"><span>剩余{{ item.residue }}件</span><button>立即抢购</button></div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="box">
            <div class="content" v-for="item in twoList" :key="item.id">
              <div class="banner">
                <img :src="item.banner" alt="">
              </div>
              <span class="title">{{ item.title }}</span>
              <div class="newPrice">￥ {{ item.newprice }}</div>
              <div class="oldPrice"><del>￥ {{ item.oldprice }}</del></div>
              <div class="residue"><span>剩余{{ item.residue }}件</span><button>立即抢购</button></div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

    </div>
    <div class="newsTimer">
      <div class="top">
        <span class="title">最新商品</span>
        <span class="right">更多<van-icon name="arrow" /></span>
      </div>
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <div class="box">
              <div class="content" v-for="item in newsOneList" :key="item.id">
              <div class="banner">
                <img :src="item.banner" alt="">
              </div>
              <span class="title">{{ item.title }}</span>
              <div class="price">
                <span>月售{{item.month}}件</span>
                <i></i>
                <span>￥ {{ item.price }}</span>
              </div>
              <div class="cart">
                <button>购买</button>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="box">
              <div class="content" v-for="item in newsTwoList" :key="item.id">
              <div class="banner">
                <img :src="item.banner" alt="">
              </div>
              <span class="title">{{ item.title }}</span>
              <div class="price">
                <span>月售{{item.month}}件</span>
                <i></i>
                <span>￥ {{ item.price }}</span>
              </div>
              <div class="cart">
                <button>购买</button>
              </div>
            </div>
          </div>
        </van-swipe-item>

      </van-swipe>
    </div>
    <div class="recommendTimer">
      <div class="top">
        <span class="title">为你推荐</span>
        <span class="right">更多<van-icon name="arrow" /></span>
      </div>
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <div class="box">
              <div class="content" v-for="item in recommendOneList" :key="item.id">
              <div class="banner">
                <img :src="item.banner" alt="">
              </div>
              <span class="title">{{ item.title }}</span>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="box">
              <div class="content" v-for="item in recommendTwoList" :key="item.id">
              <div class="banner">
                <img :src="item.banner" alt="">
              </div>
              <span class="title">{{ item.title }}</span>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="hot-sale">
      <div class="top">
        热销产品
      </div>
      <van-grid ref="hotText" direction="horizontal" :column-num="4">
        <van-grid-item  text="综合" @click="hotTab(0)"/>
        <van-grid-item  text="销量" @click="hotTab(1)"/>
        <van-grid-item  :icon="icon" text="价格" @click="hotTab(2)"/>
        <van-grid-item  text="新品" @click="hotTab(3)"/>
      </van-grid>
      <keep-alive>
        <component :is="comName"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import ZongHe from '@/components/market/zongHe-vue.vue'
import Volume from '@/components/market/Volume-vue.vue'
import Price from '@/components/market/price-vue.vue'
import Timer from '@/components/market/timer-vue.vue'

export default {
  data () {
    return {
      value: '',
      time: 6 * 60 * 60 * 1000,
      list: [],
      nav: [
        { icon: 'http://localhost/app/thumb.php?img=/i/2023/04/19/fo2c0t.png', title: '米面粮油' },
        { icon: 'http://localhost/app/thumb.php?img=/i/2023/04/19/fo2bry.png', title: '果蔬生鲜' },
        { icon: 'http://localhost/app/thumb.php?img=/i/2023/04/19/fp38wr.png', title: '厨房电器' },
        { icon: 'http://localhost/i/2023/04/19/n7g06o.jpg', title: '调味品' },
        { icon: 'http://localhost/app/thumb.php?img=/i/2023/04/19/fo2bga.png', title: '厨房餐具' },
        { icon: 'http://localhost/app/thumb.php?img=/i/2023/04/19/fo2foa.png', title: '养生食材' }
      ],
      oneList: [],
      twoList: [],
      newsOneList: [],
      newsTwoList: [],
      recommendOneList: [],
      recommendTwoList: [],
      hotList: ['综合', '销量', '价格', '新品'],
      icon: 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png',
      comName: 'ZongHe'
    }
  },
  methods: {
    async getSwiper () {
      const { data: res } = await this.$http.get('/my/getMarketSwiper')
      if (res.status === 200) {
        this.list = [...res.data]
      }
    },
    async getLimit () {
      const { data: res } = await this.$http.get('/my/getMarketLimit')
      if (res.status === 200) {
        for (let i = 0; i < 3; i++) {
          this.oneList.push(res.data[i])
        }
        for (let i = 3; i < 6; i++) {
          this.twoList.push(res.data[i])
        }
      }
    },
    async getNewTrade () {
      const { data: res } = await this.$http.get('/my/getMarketNewTarde')
      if (res.status === 200) {
        for (let i = 0; i < 6; i++) {
          this.newsOneList.push(res.data[i])
        }
        for (let i = 6; i < 12; i++) {
          this.newsTwoList.push(res.data[i])
        }
      }
    },
    async getRecommend () {
      const { data: res } = await this.$http.get('/my/getMarketRecommend')
      if (res.status === 200) {
        for (let i = 0; i < 3; i++) {
          this.recommendOneList.push(res.data[i])
        }
        for (let i = 3; i < 6; i++) {
          this.recommendTwoList.push(res.data[i])
        }
      }
    },
    hotTab (id, e) {
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
          if (this.icon === 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png') {
            this.icon = 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxceia.png'
          } else {
            this.icon = 'http://localhost/app/thumb.php?img=/i/2023/04/21/gxci7h.png'
          }
          this.$store.commit('updateIsDesc')
          this.comName = 'Price'
          break
        case 3:
          this.comName = 'Timer'
          break
      }
    },
    onSearch (val) {
      Toast(val)
    },
    onCancel () {
      Toast('购物')
    },
    toPage (id, title) {
      switch (id) {
        case 0:
          this.$router.push('/marketNav/' + title + '')
          break
        case 1:
          this.$router.push('/marketNav/' + title + '')
          break
        case 2:
          this.$router.push('/marketNav/' + title + '')
          break
        case 3:
          this.$router.push('/marketNav/' + title + '')
          break
        case 4:
          this.$router.push('/marketNav/' + title + '')
          break
        case 5:
          this.$router.push('/marketNav/' + title + '')
          break
      }
    },
    toDetails (e, id) {
      this.$router.push('/marketDetails/' + id + '')
    }
  },
  created () {
    this.getSwiper()
    this.getLimit()
    this.getNewTrade()
    this.getRecommend()
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
.market-container{
  margin-top: 54px;
  margin-bottom: 50px;
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-search--show-action{
    z-index: 999;
    background: #ffdd00;
    width: 100%;
    position: fixed;
    top: 0;
  }
  /deep/.van-search__action{
    font-size: 30px;
  }
  .banner{
    width: 100%;
    height: 237px;
  }
  .swiper{
    font-size: 12px;
    color: #EDE6E5;
    position: absolute;
    bottom: 10%;
    left: 10%;
    .title{
      font-size: 20px;
      color: #FDFAFA;
    }
    .tart{
      position: relative;
      top: 10px;
    }
    .tips{
      width: 54px;
      text-align: center;
      border: 1px solid #EDE6E5;
      position: relative;
      left: 259px;
    }
  }
  .limitTimer{
    .top{
      font-size: 12px;
      margin: 15px 15px;

      .title{
        font-size: 18px;
      }
      .timer{
        font-size: 12px;
        float: right;
        .colon {
          display: inline-block;
          margin: 0 4px;
          color: #ee0a24;
        }
        .block {
          display: inline-block;
          width: 22px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          background-color: #ee0a24;
        }
      }
      div{
        display: inline-block;
      }
    }
    .box{
      // margin: 0 15px;

      margin-left: 15px;
      display: flex;
      .content{
        margin-right: 15px;
        flex: 1;
        float: left;
        .banner{
          height: 102px;
          img{
            width: 100%;
          }
        }
        .title{
          display: inline-block;
          margin-top: 12px;
          font-size: 12px;
        }
        .newPrice{
          padding-left: 30px;
          font-size: 14px;
          color: #FF7105;
        }
        .oldPrice{
          padding-left: 40px;
          font-size: 12px;
          color: #7C7C7C;
        }
        .residue{
          width: 110px;
          height: 28px;
          line-height: 28px;
          // float: left;
          font-size: 12px;
          background: #fff;
          button{
            // width: 40px;
            border: 0;
            color: #fff;
            background: #FF7105;
          }
        }
      }
    }
  }
  .newsTimer{
    .top{
      font-size: 12px;
      margin: 15px 15px;

      .title{
        font-size: 18px;
      }
      .right{
        color: #F8A463;
        float: right;
      }

    }
    .box{
      // margin: 0 15px;

      margin-left: 15px;
      .content{
        width: 28%;
        margin-right: 15px;
        float: left;
        margin-bottom: 10px;
        .banner{
          height: 102px;
          img{
            width: 100%;
          }
        }
        .title{
          display: inline-block;
          margin-top: 12px;
          font-size: 12px;
        }
        .price{
          text-align: center;
          background: #fff;
          font-size: 12px;
          i{
            display: inline-block;
            width: 1px;
            height: 10px;
            background: #000;
            transform: translate(0,1px);
            margin: 0 2px;
          }
        }
        .cart{
          margin-top: 5px;
          font-size: 12px;
          button{
            float: right;
            width: 40px;
            height: 23px;
            color: #FBD0AE;
            border: 0;
            background: #FE7005;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .recommendTimer{
    .top{
      font-size: 12px;
      margin: 15px 15px;

      .title{
        font-size: 18px;
      }
      .right{
        color: #F8A463;
        float: right;
      }

    }
    .box{
      // margin: 0 15px;

      margin-left: 15px;
      .content{
        width: 28%;
        margin-right: 15px;
        float: left;
        margin-bottom: 10px;
        .banner{
          height: 102px;
          img{
            width: 100%;
          }
        }
        .title{
          display: inline-block;
          margin-top: 12px;
          font-size: 12px;
        }
        .price{
          text-align: center;
          background: #fff;
          font-size: 12px;
          i{
            display: inline-block;
            width: 1px;
            height: 10px;
            background: #000;
            transform: translate(0,1px);
            margin: 0 2px;
          }
        }
        .cart{
          margin-top: 5px;
          font-size: 12px;
          button{
            float: right;
            width: 40px;
            height: 23px;
            color: #FBD0AE;
            border: 0;
            background: #FE7005;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .hot-sale{
    margin: 0 15px;
    .top{
      margin: 15px 0;
      font-size: 18px;
    }
    /deep/.van-grid-item__text{
      font-size: 15px;
    }
    .active{
      color: #FEA662;
    }
    /deep/.van-grid-item__icon{
      font-size: 16px;
    }
  }
}
</style>
