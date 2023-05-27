<template>
  <div class="cart-container">
    <div class="isCart" v-if="show">
      <NavBar :title="title"></NavBar>
    <div class="box" v-for="(item,index) in cart" :key="item.id">
      <div class="header">
      <van-checkbox v-model="checked[index+1]" @click="check(index)" ><van-icon name="shop-o" size="18" /> {{ shop[index] }}<van-icon name="arrow" /></van-checkbox>
      </div>
      <van-swipe-cell>
      <van-card
      :num="item.num"
      :price="item.price"
      :desc="item.sp"
      :title="details[index].title"
      class="goods-card"
      :thumb="details[index].banner"
      />
      <van-button class="btn add" type="default" size="mini" @click="add(index)">+</van-button>
      <van-button class="btn" type="default" size="mini" @click="sub(index)">-</van-button>
      <template #right>
        <van-button square text="删除" @click="subCart(item.id)" type="danger" class="delete-button" />
      </template>
    </van-swipe-cell>
    <div class="freight">
      <van-cell-group>
        <van-cell title="运费" :value="'￥'+details[index].freight" />
      </van-cell-group>
    </div>
    </div>
    <transition name="van-slide-up">
      <div v-show="visible" class="tips">最少选择一件哦</div>
    </transition>
    <footer>
      <van-checkbox v-model="checked[0]" @click="zonCheck()">
        全选
      </van-checkbox>
      <span class="price">合计: <span class="pri">￥{{ sum }}</span> </span>
      <van-button class="btn" type="warning" @click="deal">结算</van-button>
    </footer>
    </div>
    <div class="isCart" v-else>
      <Deal></Deal>
    </div>
    </div>
</template>

<script>
import NavBar from '@/components/Navbar-vue.vue'
import Deal from '@/components/shopping/deal-vue.vue'

export default {
  data () {
    return {
      show: true,
      token: '',
      count: 0,
      title: '购物车',
      checked: [false],
      sum: '0.00',
      shop: [],
      details: [],
      cart: [],
      visible: false
    }
  },
  methods: {
    // 获取购物车
    async getCart () {
      const { data: res } = await this.$http({
        url: '/api/getCart',
        method: 'get',
        headers: {
          authorization: this.token
        }
      })
      if (res.status === 200) {
        res.data.forEach((item, index) => {
          this.getShop(item.mid)
          this.getDetails(item.sid)
          this.cart.push({ id: item.id, sp: item.specification, price: item.price, num: item.num })
          this.checked.push(false)
        })
        console.log(this.cart.length)
        if (this.cart.length === 0) {
          alert('您还没有选择商品加入购物车')
        }
      }
    },
    // 获取商品信息
    async getDetails (_id) {
      const { data: res } = await this.$http.get('/my/getMarketDetails', { params: { id: _id } })
      if (res.status === 200) {
        this.details.push({ banner: res.data.banner, title: res.data.title, freight: res.data.freight })
      }
    },
    // 获取商铺信息
    async getShop (_id) {
      const { data: res } = await this.$http.get('/my/getMarketShop', { params: { id: _id } })
      if (res.status === 200) {
        this.shop.push(res.data.name)
      }
    },
    // 删除购物车中的商品
    async deleteCart (_id) {
      const { data: res } = await this.$http.get('/api/deleteCart', { headers: { authorization: this.token }, params: { id: _id } })
      if (res.status === 200) {
        alert(res.msg)
        this.cart = []
        this.checked = []
        this.details = []
        this.shop = []
        this.getCart()
      }
    },
    check (_index) {
      const temp = []
      this.checked.forEach((item, index) => {
        if (index !== 0) {
          temp.push(item)
        }
      })
      const flag = temp.some(item => {
        if (!item) {
          return true
        }
        return false
      })
      if (!flag) {
        this.checked[0] = true
      } else {
        this.checked[0] = false
      }
      this.sum = '0.00'
      temp.forEach((item, index) => {
        if (item) {
          const price = parseFloat(this.cart[index].price)
          const num = this.cart[index].num
          this.sum = parseFloat(this.sum)
          let pr = this.sum + price * num + this.details[index].freight
          pr = pr.toFixed(2)
          this.sum = pr
        }
      })
    },
    zonCheck () {
      if (this.checked[0]) {
        const temp = this.checked
        this.checked = []
        this.checked.push(temp[0])
        temp.forEach((item, index) => {
          if (index !== 0) {
            this.checked.push(true)
          }
        })
        this.sum = '0.00'
        this.checked.forEach((item, index) => {
          if (index !== 0) {
            const price = parseFloat(this.cart[index - 1].price)
            const num = this.cart[index - 1].num
            this.sum = parseFloat(this.sum)
            let pr = this.sum + price * num + this.details[index - 1].freight
            pr = pr.toFixed(2)
            this.sum = pr
          }
        })
      } else {
        const temp = this.checked
        this.checked = []
        this.checked.push(temp[0])
        temp.forEach((item, index) => {
          if (index !== 0) {
            this.checked.push(false)
          }
        })
        this.sum = '0.00'
      }
    },
    add (_index) {
      this.cart[_index].num++
      const temp = []
      this.checked.forEach((item, index) => {
        if (index !== 0) {
          temp.push(item)
        }
      })
      this.sum = '0.00'
      temp.forEach((item, index) => {
        if (item) {
          const price = parseFloat(this.cart[index].price)
          const num = this.cart[index].num
          this.sum = parseFloat(this.sum)
          let pr = this.sum + price * num + this.details[index].freight
          pr = pr.toFixed(2)
          this.sum = pr
        }
      })
    },
    sub (_index) {
      if (this.cart[_index].num > 1) {
        this.cart[_index].num--
        const temp = []
        this.checked.forEach((item, index) => {
          if (index !== 0) {
            temp.push(item)
          }
        })
        this.sum = '0.00'
        temp.forEach((item, index) => {
          if (item) {
            const price = parseFloat(this.cart[index].price)
            const num = this.cart[index].num
            this.sum = parseFloat(this.sum)
            let pr = this.sum + price * num + this.details[index].freight
            pr = pr.toFixed(2)
            this.sum = pr
          }
        })
      } else {
        this.visible = true
        setTimeout(() => {
          this.visible = false
        }, 1000)
      }
    },
    subCart (id) {
      this.deleteCart(id)
    },
    deal () {
      const temp = []
      this.checked.forEach((item, index) => {
        if (index !== 0) {
          if (item) {
            temp.push(item)
          }
        }
      })
      if (temp.length === 0) {
        return alert('请选择您想要结算的商品')
      }
      temp.forEach(item => {
        if (item) {
          console.log(item)
        }
      })
      console.log('结算')
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
    this.getCart()
  },
  components: {
    NavBar,
    Deal
  }
}
</script>

<style lang="less" scoped>
.cart-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  .box{
    margin-bottom: 10px;
    background: #fff;
    .header{
      font-size: 14px;
      padding-left: 15px;
      /deep/.van-checkbox{
        height: 30px;
      }
    }
    .btn{
      margin: 0;
      width: 24px;
      height: 24px;
      position: absolute;
      top:68%;
      left:79%;
    }
    .add{
      left: 92%;
    }
    .goods-card {
    margin: 0;
    background-color:#fff;
    }
    /deep/.van-card__price{
      color: #ff6600;
    }
    /deep/.van-card__bottom{
      padding-right: 20px;
    }
    .delete-button {
    height: 100%;
    }
  }
  .tips{
    width: 150px;
    height: 150px;
    color: #fff;
    text-align: center;
    line-height: 150px;
    background: rgba(30, 139, 250,80%);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 24px;
  }
  footer{
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    width: 100%;
    position: fixed;
    height: 44px;
    bottom: 0;
    background: #fff;
    /deep/.van-button--warning{
      background: #ff6600;
    }
    .btn{
      // position: absolute;
      // bottom: 0;
      // right: 16px;
    }
    /deep/.van-checkbox{
      height: 44px;
    }
    .price{
      line-height: 44px;
      font-size: 14px;
      .pri{
        font-size: 16px;
        color: #ff6600;
      }
    }
  }
}
</style>
