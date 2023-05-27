<template>
  <div class="taboo-container">
    <div class="fear">
      <div class="title">
        1.忌
      </div>
      <p v-for="(item,index) in fear" :key="index">{{ item }}</p>
    </div>
    <hr>
    <div class="suitable">
      <div class="title">
        2.宜
      </div>
      <p v-for="(item,index) in suitable" :key="index">{{ item }}</p>
    </div>
    <div class="choice">
      <div class="title">
        3.挑选技巧
      </div>
      <p v-for="(item,index) in choice" :key="index">{{ item }}</p>
     <!-- <p> 2、颜色：看小龙虾是清水是浑水，一看背部，红亮干净，这就尚可，再翻开看它的腹部绒毛和爪上的毫毛，这里如果是白净整齐，基本上是干净水质养出来的。</p>
     <p> 3、大小：我们尽量要买刚刚长大的龙虾，太小的呢，毕竟食之无味，用手碰碰它的壳，铁硬铁硬的是老的无疑，像指甲一样有弹性的才是刚长大才换壳的，所以我们要买软壳的。</p> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: -1,
      fear: [],
      suitable: [],
      choice: [],
      token: ''
    }
  },
  methods: {
    async getTaboo (id) {
      const { data: res } = await this.$http.get('/api/baike/taboo', { params: { id: id }, headers: { authorization: this.token } })
      if (res.status === 200) {
        const fr = res.data.fear
        this.fear = fr.split('&')
        const stb = res.data.suitable
        this.suitable = stb.split('&')
        const cho = res.data.choice
        this.choice = cho.split('&')
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
      this.getTaboo(this.id)
    }
  }
}
</script>

<style lang="less" scoped>
.taboo-container{
  min-height: 100vh;
  background: #f5f5f5;
    padding: 10px;
    color: #656565;
    font-size: 12px;
    hr{
      width: 90%;
    }
}
</style>
