<template>
  <div class="setNews-container">
    <Navbar :title="title"></Navbar>

    <van-cell v-for="item in newsList" :key="item.left" :title="item.left">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-switch v-model="item.state" active-color="#ffdd00" inactive-color="#dcdee0" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar-vue.vue'
import qs from 'qs'

export default {
  data () {
    return {
      title: '消息推送',
      list: ['评论相关', '收藏相关', '关注相关', '官方通知', '每日推荐'],
      comment: '',
      collect: '',
      attention: '',
      official: '',
      everyday: '',
      token: '',
      newsList: [],
      stateList: []
    }
  },
  methods: {
    async getNews () {
      const { data: res } = await this.$http.get('/api/getNews', { headers: { authorization: this.token } })
      if (res.status === 200) {
        if (res.data.attention === 'true') {
          this.attention = true
        } else {
          this.attention = false
        }
        if (res.data.collect === 'true') {
          this.collect = true
        } else {
          this.collect = false
        }
        if (res.data.comment === 'true') {
          this.comment = true
        } else {
          this.comment = false
        }
        if (res.data.everyday === 'true') {
          this.everyday = true
        } else {
          this.everyday = false
        }
        if (res.data.official === 'true') {
          this.official = true
        } else {
          this.official = false
        }
        this.stateList = [this.comment, this.collect, this.attention, this.official, this.everyday]
        this.list.forEach((item, index) => {
          this.newsList.push({ left: item, state: this.stateList[index] })
        })
      }
    },
    async setNews (flag) {
      const data = qs.stringify({ list: flag })
      const { data: res } = await this.$http({
        url: '/api/setNews',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status === 200) return false
    }
  },
  watch: {
    newsList: {
      handler (newVal) {
        const arr = newVal.map(item => {
          return item.state
        })
        this.setNews(arr)
      },
      // 开启深度侦听，info对象的每个属性值发生变化时，都会被触发
      deep: true
    }
  },
  created () {
    this.token = localStorage.getItem('fengyuepintan')
    if (this.token === null || this.token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.getNews()
    }
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
.setNews-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-cell{
    border-bottom: 6px solid #f5f5f5;
  }
}
</style>
