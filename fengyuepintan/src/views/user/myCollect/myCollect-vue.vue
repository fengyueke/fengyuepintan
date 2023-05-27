<template>
  <div class="myMenu-container">
    <Navbar :title="title"></Navbar>
    <dl v-for="item in menuList" :key="item.id">
      <dt><img :src="item.url"></dt>
      <dd>{{ item.title }}</dd>
      <dd>{{ item.liked }}</dd>
      <dd>{{ item.publishTime }}</dd>
    </dl>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar-vue.vue'
export default {
  data () {
    return {
      title: '我的收藏',
      token: '',
      list: [],
      menuList: []
    }
  },
  methods: {
    async getInfo () {
      const { data: res } = await this.$http.get('/my/myinfo', { headers: { authorization: this.token } })
      if (res.status === 200) {
        this.list = res.data.collect.split(',')
        this.list.forEach(item => {
          item = parseInt(item)
          this.getMenu(item)
        })
      }
    },
    async getMenu (_id) {
      const { data: res } = await this.$http.get('/api/menu', { params: { id: _id }, headers: { authorization: this.token } })
      if (res.status === 200) {
        this.menuList.push(res.data)
      }
    }
  },
  created () {
    this.token = localStorage.getItem('fengyuepintan')
    if (this.token === null || this.token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.getInfo()
    }
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
.myMenu-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  dl{
    position: relative;
    dt{
    width: 35%;
    img{
      width: 100%;
    }
  }
  :nth-child(2){
    font-size: 16px;
    color: #6A6A6A;
    }
    :nth-child(3){
    font-size: 12px;
    transform: translate(-2px, 33px);
    color: #686868;
    }
    :nth-child(4){
    font-size: 12px;
    transform: translate(0px,95px);
    color: #686868;
    }
  dd{
    top: 20px;
    left: 38%;
    margin-left: 0;
    position: absolute;
  }
  }

}
</style>
