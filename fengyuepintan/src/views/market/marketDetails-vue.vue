<template>
  <div class="detail-container">
    <div class="navbar">
      <van-nav-bar title="商品详情" @click-left="$router.back()">
        <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
        <template #right>
          <van-icon name="shopping-cart-o" size="25" @click="shopping"/>
          <van-icon name="share-o" size="25"  @click="showShare = true"/>
        </template>
      </van-nav-bar>
      <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      />
    </div>
    <div class="banner">
      <img :src="list.banner" alt="">
    </div>
    <div class="info">
      <span>{{ list.title }}</span>
      <div class="data">
        <van-cell-group>
          <van-cell :title="'￥'+cPrice" class="price" />
          <van-cell title="月售" :value="list.month" />
          <van-cell title="运费" :value="list.freight" />
        </van-cell-group>
      </div>
    </div>
    <div class="recommend">
      {{ list.recommend }}
    </div>
    <div class="specification">
      <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="规格"
      placeholder="请选择商品规格"
      @click="show = true"
      />
      <van-popup v-model="show" round position="bottom">
        <van-cascader
        v-model="cascaderValue"
        title="请选择商品规格"
        :options="options"
        @close="show = false"
        @finish="onFinish"
        />
      </van-popup>
    </div>
    <div class="comment">
      <div class="title">
        <van-cell-group>
          <van-cell :title="'晒单评价('+comment.length+')'" :value="good+'%好评率'" />
        </van-cell-group>
      </div>
      <div v-for="(item,index) in 2" :key="item" class="content">
              <div class="userInfo">
            <img :src="user[index].hp" alt="">
            <span>{{ user[index].nickname }}</span>
            <i>{{ ping[index] }}</i>
        </div>
        <div class="nei">
          <span>{{ '&nbsp;&nbsp;&nbsp;&nbsp;'+ comment[index] }}</span>
          <div class="banner">
            <van-grid>
              <van-grid-item v-for="(item,index) in commentBanner[index]" :key="index" :icon="item" />
            </van-grid>
          </div>
        </div>
      </div>
      <div class="bottom">
        <span class="more" @click="pingShow= true">查看更多评价</span>
        <van-action-sheet v-model="pingShow" title="评论">
          <div class="tt">
            <div v-for="(item,index) in user" :key="item.uid" class="content">
              <div class="userInfo">
            <img :src="item.hp" alt="">
            <span>{{ item.nickname }}</span>
            <i>{{ ping[index] }}</i>
        </div>
        <div class="nei">
          <span>{{ '&nbsp;&nbsp;&nbsp;&nbsp;'+ comment[index] }}</span>
          <div class="banner">
            <van-grid>
              <van-grid-item v-for="(item,index) in commentBanner[index]" :key="index" :icon="item" />
            </van-grid>
          </div>
        </div>
      </div>
          </div>
        </van-action-sheet>
      </div>
    </div>
    <div class="shop" @click="$router.push('/marketShop/'+shopInfo.mid+'')">
      <div class="title">
        <span>店铺信息</span>
        <span>风月认证</span>
      </div>
      <div class="info">
        <img :src="shopInfo.logo" alt="">
        <ul>
          <li>{{ shopInfo.name }}</li>
          <li>全部商品 {{ shopInfo.stock }}</li>
          <li>新鲜生活，感受味道</li>
        </ul>
      </div>
      <van-tag plain type="warning">进店逛逛</van-tag>
      <div class="evaluate">
        <span>描述相符 <i>{{ shopInfo.describe }}</i></span>
        <span>服务态度 <i>{{ shopInfo.serve }}</i></span>
        <span>发货速度 <i>{{ shopInfo.speed }}</i></span>
      </div>
    </div>
    <div class="qualified">
      <img v-for="(item,index) in qualified" :key="index" :src="item" alt="">
    </div>
    <footer>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
        <van-goods-action-icon icon="shop-o" text="店铺" />
         <!-- <van-goods-action-icon icon="star" text="已收藏" color="#ff5000" /> -->
        <van-goods-action-button type="warning" text="加入购物车" @click="addShopping" />
        <van-goods-action-button type="danger" text="立即购买" />
      </van-goods-action>
    </footer>
    <van-sku
    v-model="skuShow"
    :sku="sku"
    :goods="goods"
    :goods-id="this.$route.params.id"
    :hide-stock="sku.hide_stock"
    @buy-clicked="onBuyClicked"
    @add-cart="onAddCartClicked"
    @stepper-change="stepperChanged"
    ref="getSkuData"
    />
  </div>
</template>

<script>
import qs from 'qs'

export default {
  data () {
    return {
      token: '',
      skuShow: false,
      sku: {
        // 数据结构见下方文档
        tree: [
          {
            k: '颜色', // skuKeyName：规格类目名称
            k_s: 's1', // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [
              {
                id: '1', // skuValueId：规格值 id
                name: '红色' // skuValueName：规格值名称
              },
              {
                id: '2',
                name: '蓝色'
              }
            ],
            largeImageMode: false //  是否展示大图模式
          }
        ],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [
          {
            id: 2259, // skuId
            s1: '1', // 规格类目 k_s 为 s1 的对应规格值 id
            s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
            price: 100, // 价格（单位分）
            stock_num: 110 // 当前 sku 组合对应的库存
          },
          {
            id: 2230, // skuId
            s1: '2', // 规格类目 k_s 为 s1 的对应规格值 id
            s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
            price: 10000, // 价格（单位分）
            stock_num: 110 // 当前 sku 组合对应的库存
          }
        ],
        price: '0.00', // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        messages: [
          {
            // 商品留言
            datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
            multiple: '0', // 留言类型为 text 时，是否多行文本。'1' 表示多行
            name: '留言', // 留言名称
            type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
            required: '0', // 是否必填 '1' 表示必填
            placeholder: '', // 可选值，占位文本
            extraDesc: '' // 可选值，附加描述文案
          }
        ],
        hide_stock: true // 是否隐藏剩余库存

      },
      goods: {
        // 数据结构见下方文档
        picture: 'http://localhost/app/thumb.php?img=/i/2023/04/19/dxd0b1.jpg'
      },
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
      show: false,
      fieldValue: '',
      cascaderValue: '',
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
      list: [],
      price: [],
      cPrice: 0,
      comment: [],
      commentId: [],
      commentBanner: [],
      commentGood: [],
      good: 0,
      shopInfo: {},
      qualified: [],
      user: [],
      ping: [],
      pingShow: false,
      count: 1,
      initCartPrice: ''
    }
  },
  methods: {
    async getDetails () {
      const { data: res } = await this.$http.get('/my/getMarketDetails', { params: { id: this.$route.params.id } })
      if (res.status === 200) {
        this.list = res.data
        let specification = res.data.specification
        specification = specification.split(',')
        for (let i = 0; i < specification.length; i++) {
          if (i % 2 !== 0) {
            this.price.push(specification[i])
          }
        }
        const arr = []
        for (let i = 0; i < specification.length; i++) {
          if (i % 2 === 0) {
            arr.push(specification[i])
          }
        }
        const children = []
        arr.forEach((item, index) => {
          children.push({ text: item, value: '33010' + index })
        })
        this.options = [{
          text: res.data.name,
          value: '330000',
          children: children
        }]
        this.comment = res.data.comment.split('&')
        this.commentId = res.data.commentId.split(',')
        const commentBanners = res.data.commentBanner.split('&')
        this.commentBanner = commentBanners.map((item, index) => {
          let arr = item.split(',')
          arr = arr.map((ele) => {
            return ele
          })
          return arr
        })
        const stock = res.data.stock.split(',')
        const describe = res.data.describe.split(',')
        const arr2 = []
        describe.forEach(item => {
          item = parseInt(item)
          arr2.push(item)
        })
        let tem1 = 0
        arr2.forEach(item => {
          tem1 += item
        })
        tem1 = tem1 / arr2.length
        const serve = res.data.describe.split(',')
        const arr3 = []
        serve.forEach(item => {
          item = parseInt(item)
          arr3.push(item)
        })
        let tem2 = 0
        arr3.forEach(item => {
          tem2 += item
        })
        tem2 = tem2 / arr3.length
        const speed = res.data.describe.split(',')
        const arr4 = []
        speed.forEach(item => {
          item = parseInt(item)
          arr4.push(item)
        })
        let tem3 = 0
        arr4.forEach(item => {
          tem3 += item
        })
        tem3 = tem3 / arr4.length
        this.shopInfo = { logo: res.data.logo, name: res.data.shopName, stock: stock.length, describe: tem1, serve: tem2, speed: tem3, mid: res.data.mid }
        this.qualified = res.data.qualified.split(',')
        this.commentId.forEach(item => {
          this.getUserInfo(item)
        })
        this.commentGood = res.data.commentGood.split(',')
        let temp = 0
        this.commentGood.forEach((item, index) => {
          item = parseInt(item)
          if (item > 4) {
            this.ping.push('好评')
          } else if (item > 2) {
            this.ping.push('中评')
          } else {
            this.ping.push('差评')
          }
          this.commentGood[index] = item
          temp += item
        })
        temp = (temp / this.commentGood.length) * 20
        this.good = temp
      }
    },
    async getUserInfo (_id) {
      const { data: res } = await this.$http.get('/my/userInfo', { params: { uid: _id } })
      if (res.status === 200) {
        this.user.push({ hp: res.data.headerPh, nickname: res.data.nickname, uid: res.data.uid })
      }
    },
    async postCart (sp, msg, pr, num, mid, sid) {
      const data = qs.stringify({ sp: sp, msg: msg, price: pr, num: num, mid: mid, sid: sid })
      const { data: res } = await this.$http({
        url: '/api/PostCart',
        method: 'post',
        headers: {
          authorization: this.token
        },
        data: data
      })
      if (res.status === 200) {
        alert('添加成功')
        this.skuShow = false
        this.$router.push('/cart')
      }
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish ({ selectedOptions }) {
      this.show = false
      this.fieldValue = selectedOptions.map((option) => option.text).join('/')
      // console.log(this.cascaderValue.substring(5))
      this.cPrice = this.price[this.cascaderValue.substring(5)]
    },
    shopping () {
      this.$router.push('/cart')
    },
    addShopping () {
      this.skuShow = true
      if (this.options.length !== 1) {
        this.options.forEach(item => {
          console.log(item)
        })
      } else {
        this.sku.tree[0].k = this.options[0].text
        this.sku.list = []
        this.sku.tree[0].v = []
        this.options[0].children.forEach((item, index) => {
          let temp = this.price[index].split('.')
          if (temp.length === 1) {
            temp = temp[0] + '0'
          } else {
            if (temp[1].length === 1) {
              temp = temp[0] + '0'
            } else {
              temp = temp[0] + '0'
            }
          }
          this.sku.tree[0].v.push({
            id: item.value,
            name: item.text
          })
          this.sku.list.push({
            id: item.value, // skuId
            s1: item.value, // 规格类目 k_s 为 s1 的对应规格值 id
            s2: '1', // 规格类目 k_s 为 s2 的对应规格值 id
            price: temp, // 价格（单位分）
            stock_num: 110 // 当前 sku 组合对应的库存
          })
        })
      }
      this.goods.picture = this.list.banner
    },
    stepperChanged (data) {
      // 更改商品数量时触发
      this.count = data
    },
    onBuyClicked () {},
    onAddCartClicked (data) {
      const pr = this.$refs.getSkuData.$el.childNodes[0].childNodes[1].childNodes[0].childNodes[1].innerText
      let sp = ''
      this.options[0].children.forEach(item => {
        if (item.value === data.selectedSkuComb.id) {
          sp = item.text
        }
      })
      const msg = data.cartMessages.留言
      const mid = this.list.mid
      const sid = this.list.id
      this.postCart(sp, msg, pr, this.count, mid, sid)
    },
    share () {
      console.log('分享')
    },
    pingSheet () {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
    }
  },
  created () {
    this.token = localStorage.getItem('fengyuepintan')
    if (this.token === null || this.token === '') {
      alert('请先登录')
      this.$router.push('/login')
      return
    }
    this.getDetails()
  }
}

</script>

<style lang="less" scoped>
  .detail-container{
    margin-bottom: 50px;
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
      /deep/.van-icon:before{
        margin: 10px;
      }
    }
    .banner{
      img{
        width: 100%;
        height: 237px;
      }
    }
    .info{
      background: #fff;
      color: #6C6C6C;
      padding: 5px 15px;
      font-size: 14px;
      .price{
        color: #FDB278;
      }
      .data{
        /deep/.van-cell{
          padding: 0;
        }

      }

    }
    .recommend{
      overflow: auto;
      color: #757575;
      font-size: 14px;
      margin: 10px 0;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #fff;
    }
    .comment{
      background: #fff;
      font-size: 12px;
      margin-top: 10px;
      /deep/.van-cell{
        border-bottom: 1px solid #E6E6E6;
      }
      .content{
        border-bottom: 1px solid #E8E8E8;
        background: #fff;
        .userInfo{
          padding: 15px;
          img{
            width: 30px;
            border-radius: 50%;
          }
          span{
            font-size: 14px;
            display: inline-block;
            transform: translate(10px,-10px);
          }
          i{
            margin-top: 7px;
            float: right;
          }
        }
        .nei{
          span{
            display: inline-block;
            margin: 0 15px;
          }
          .banner{
            /deep/.van-grid-item__icon{
              font-size: 66px;
            }
          }
        }
      }
      .bottom{
        color: #BCBCBC;
        .more{
          display: inline-block;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
    .shop{
      margin-top: 10px;
      background: #fff;
      font-size: 12px;
      .title{
        font-size: 14px;
        line-height: 40px;
        height: 40px;
        padding: 0 15px;
        :nth-child(2){
          color: #A1D8A3;
          font-size: 12px;
          float: right;
        }
        border-bottom: 1px solid #EEEEEE;
      }
      .info{
        color: #BBBBBB;
        font-size: 12px;
        img{
          float: left;
          width: 30px;
          border-radius: 50%;
        }
        ul{
          float: left;
          li{
            margin-left: 10px;
          }
          :nth-child(1){
            font-size: 14px;
            color: #646464;
          }
        }
      border-bottom: 1px solid #EEEEEE;

      }
      /deep/.van-tag--warning.van-tag--plain{
        float: right;
        margin-right: 15px;
      }
      .evaluate{
        display: flex;
        text-align: center;
        height: 40px;
        line-height: 40px;
        margin-top: 50px;
        span{
          color: #8B8B8B;
          flex: 1;
          i{
            color: #000;
          }
        }
      }
    }
    .qualified{
      margin-top: 10px;
      img{
        width: 100%;
      }
    }
  }
</style>
