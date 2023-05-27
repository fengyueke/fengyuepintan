<template>
  <div class="nutrition-container">
    <div class="banner">
      <img :src="banner" alt="">
      <span>{{ $store.state.detailTitle }}</span>
    </div>
    <div class="cost">
      <div class="title">
        1.营养价值
      </div>
      <span v-for="(item,index) in nutrition" :key="index" >{{ item }} <br></span>
    </div>
    <hr>
    <div class="effect">
      <div class="title">
        2.功效与作用
      </div>
      <p v-for="(item,index) in effect" :key="index">{{ item }}</p>
    </div>
    <hr>
    <div class="ingredient">
      <div class="title">
        3.营养成分(每100克含量数)
      </div>
      <van-cell-group>
        <van-cell v-for="(item) in ingredient" :key="item.ingredient" :title="item.ingredient" :value="item.amount" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: -1,
      nutrition: [],
      effect: [],
      ingredient: [],
      banner: '',
      token: ''
    }
  },
  methods: {
    async getNutrition (id) {
      const { data: res } = await this.$http.get('/api/baike/nutritional', { params: { id: id }, headers: { authorization: this.token } })
      if (res.status === 200) {
        this.banner = res.data.url
        const nutri = res.data.nutrition
        this.nutrition = nutri.split('&')
        const eff = res.data.effect
        this.effect = eff.split('&')
        let ingred = res.data.ingredient
        ingred = ingred.split(',')
        const even = ingred.filter((item, index) => {
          if (index % 2 === 0) {
            return item
          }
          return false
        })
        const odd = ingred.filter((item, index) => {
          if (index % 2 !== 0) {
            return item
          }
          return false
        })
        odd.forEach((item, index) => {
          this.ingredient.push({ ingredient: even[index], amount: item })
        })
      }
    }
  },
  created () {
    const token = localStorage.getItem('fengyuepintan')
    this.token = token
    if (token === null || token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.id = this.$store.state.detailId
      this.getNutrition(this.id)
    }
  }
}
</script>

<style lang="less" scoped>
.nutrition-container{
  min-height: 100vh;
  background: #f5f5f5;
  .banner{
    padding-top: 20px;
    text-align: center;
    img{
      width: 100px;
      border-radius: 50%;
    }
    span{
      display: block;
      font-size: 14px;
      color: #818181;
      margin-top: 10px;
    }
  }
  .cost{
    padding: 10px;
    color: #656565;
    .title{
      font-size: 14px;
      margin-bottom: 5px;
    }
    span{
      font-size: 12px;
    }
  }
  hr{
    width: 90%;
    color: #BABABA;
  }
  .effect{
    padding: 10px;
    color: #656565;
    .title{
      font-size: 14px;
      margin-bottom: 5px;
    }
    p{
      font-size: 12px;
    }
  }
  .ingredient{
    padding: 10px;
    color: #656565;
    .title{
      font-size: 14px;
      margin-bottom: 5px;
    }
    /deep/.van-cell{
      background: #f5f5f5;
    }
    /deep/.van-cell::after{
      border-bottom: 1px solid #000;
    }
  }
}
</style>
