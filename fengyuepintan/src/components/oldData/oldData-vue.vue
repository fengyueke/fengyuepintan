<template>
  <div class="oldData-container">
      <div class="title">搜索历史 <span @click="clearLoc">清空</span></div>
      <van-cell-group>
        <van-cell v-for="(item,index) in locLis" :key="index" :title="item" @click="toSearch" />
      </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'oldData',
  props: ['locLis'],
  data () {
    return {
      active: -1,
      page: 1,
      limit: 10
    }
  },
  methods: {
    clearLoc () {
      this.locList = []
      if (this.active === 0) {
        localStorage.setItem('pastMenu', '')
      } else if (this.active === 1) {
        localStorage.setItem('pastUser', '')
      }
    },
    toSearch (e) {
      this.$store.commit('updataSearchOld', e.target.innerText)
      if (this.active === 0) {
        this.$router.push('/search/dimSearchMenu')
      } else if (this.active === 1) {
        this.$router.push('/search/dimSearchUser')
      }
      console.log(e.target.innerText)
    },
    async getSearch (_active, _val) {
      const { data: res } = await this.$http.get('/api/search', { params: { active: _active, val: _val, page: this.page, limit: this.limit } })
      if (res.status === 200) {
        this.list = [...this.list, ...res.data]
        console.log(this.list)
        this.loading = false
        if (res.data.length === 0) {
          this.finished = true
        }
      }
    }
  },
  created () {
    this.active = this.$store.state.searchActive
  }
}
</script>

<style lang="less" scoped>
.oldData-container{
  .title{
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      padding:0 15px;
      span{
        font-size: 12px;
      }
    }
    /deep/.van-cell{
      background: #f5f5f5;
      border-bottom: 1px solid gray;
    }
}
</style>
