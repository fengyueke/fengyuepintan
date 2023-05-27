<template>
  <div class="search-container">
    <!-- 顶部 -->
    <van-search
    v-model.trim="value"
    show-action
    placeholder="请输入菜谱、食材名"
    shape="round"
    @search="onSearch"
    @cancel="onCancel"
  />
  <van-tabs v-model="active">
    <van-tab title="菜谱" to="/search/searchMenu"><router-view v-if="active===0"></router-view></van-tab>
     <van-tab title="用户" to="/search/searchUser"><router-view v-if="active===1"></router-view></van-tab>
     <van-tab title="商品" to="/search/searchCommodity"><router-view v-if="active===2"></router-view></van-tab>
  </van-tabs>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      value: '',
      active: 0,
      locList: [],
      locUser: [],
      user2: [],
      menuList: [],
      cache: []
    }
  },
  methods: {
    onSearch (val) {
      this.$store.commit('addSearchVal', this.value)
      if (this.active === 0) {
        if (this.$router.history.current.fullPath === '/search/searchMenu') {
          this.$router.push('/search/dimSearchMenu')
        }
        const tool = []
        if (localStorage.getItem('pastMenu') === null) {
          localStorage.setItem('pastMenu', '')
        }
        if (localStorage.getItem('pastMenu') !== '') {
          this.cache = JSON.parse(localStorage.getItem('pastMenu'))
        }
        this.cache.push(this.value)
        this.locList = new Set(this.cache)
        this.locList.forEach(item => {
          tool.unshift(item)
        })
        localStorage.setItem('pastMenu', JSON.stringify(tool))
      } else if (this.active === 1) {
        if (this.$router.history.current.fullPath === '/search/searchUser') {
          this.$router.push('/search/dimSearchUser')
        }
        const tool = []
        if (localStorage.getItem('pastUser') === null) {
          localStorage.setItem('pastUser', '')
        }
        if (localStorage.getItem('pastUser') !== '') {
          this.user2 = JSON.parse(localStorage.getItem('pastUser'))
        }
        this.user2.push(this.value)
        this.locUser = new Set(this.user2)
        this.locUser.forEach(item => {
          tool.unshift(item)
        })
        localStorage.setItem('pastUser', JSON.stringify(tool))
      }

      this.value = ''
    },
    onCancel () {
      Toast('取消')
    }
  },
  watch: {
    active (New) {
      this.$store.commit('updataSearchActive', New)
    }
  }
}
</script>

<style lang="less" scoped>
.search-container{
  /deep/.van-search--show-action{
    background: #ffdd00;
  }
  /deep/.van-tabs__line{
    background: #ffdd00;
  }
}
</style>
