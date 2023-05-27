<template>
<div class="dimSearchUser-container">
  <van-nav-bar :title="$store.state.searchVal" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" size="20"/>
      </template>
    </van-nav-bar>
    <van-list
      v-model="loading"
     :finished="finished"
     finished-text="没有更多了"
      @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item.uid" :title="item.nickname" :icon="item.headerPh">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="add-o" size="25" class="add-icon" />
        </template>
      </van-cell>
</van-list>
</div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      active: -1,
      searchVal: '',
      searchOld: '',
      page: 1,
      limit: 10,
      loading: false,
      finished: false,
      token: ''
    }
  },
  methods: {
    onLoad () {
      setTimeout(() => {
        this.loading = true
        this.page++
        this.getSearch(this.active, this.searchVal)
      }, 1000)
    },
    async getSearch (_active, _val) {
      const { data: res } = await this.$http.get('/api/search', { params: { active: _active, val: _val, page: this.page, limit: this.limit }, headers: { authorization: this.token } })
      if (res.status === 200) {
        this.list = [...this.list, ...res.data]
        this.loading = false
        if (res.data.length === 0) {
          this.finished = true
        }
      } else if (res.msg === 'No authorization token was found') {
        alert('请先登录')
        this.$router.replace('/login')
      }
    },
    onClickLeft () {
      this.$router.back()
    }
  },
  created () {
    const token = localStorage.getItem('fengyuepintan')
    this.token = token
    if (token === null || token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.searchOld = this.$store.state.searchOld
      this.active = this.$store.state.searchActive
      this.searchVal = this.$store.state.searchVal
      if (this.searchOld !== '') {
        this.getSearch(this.active, this.searchOld)
      } else {
        this.getSearch(this.active, this.searchVal)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dimSearchUser-container{
  /deep/.van-cell{
    background-color: #f5f5f5;
    border-bottom: 1px solid gray;
  }
  /deep/.van-icon__image{
    font-size: 25px;
    border-radius: 50%;
  }
  /deep/.van-cell__title{
    font-size: 18px;
  }
  /deep/.van-icon:before{
    color: #FF6E01;
  }
}
</style>
