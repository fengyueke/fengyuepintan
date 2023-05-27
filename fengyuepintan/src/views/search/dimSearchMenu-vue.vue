<template>
  <div class="dimSearchMenu-container">
    <van-nav-bar :title="$store.state.searchVal" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" size="20"/>
      </template>
    </van-nav-bar>
    <van-notice-bar
      scrollable
      left-icon="volume-o"
      text="根据收藏量进行排序"
    />
    <van-list
      v-model="loading"
     :finished="finished"
     finished-text="没有更多了"
      @load="onLoad"
      >
      <dl v-for="item in list" :key="item.id">
      <dt><img :src="item.url" alt=""></dt>
      <dd class="title">{{ item.title }}</dd>
      <dd class="user">{{ item.nickname }}</dd>
      <dd class="collect">{{item.collect}}&nbsp;&nbsp;收藏<span>{{ item.publishTime }}</span></dd>
      </dl>
    </van-list>

  </div>

</template>

<script>
export default {
  data () {
    return {
      list: [],
      searchVal: '',
      searchOld: '',
      active: -1,
      page: 1,
      limit: 10,
      loading: true,
      finished: false,
      token: ''
    }
  },
  methods: {
    onLoad () {
      this.loading = true
      this.page++
      this.getSearch(this.active, this.searchVal)
    },
    onClickLeft () {
      this.$router.back()
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
.dimSearchMenu-container{
  /deep/.van-nav-bar__content{
    background: #f5f5f5;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  dl{
    position: relative;
    padding-left: 15px;
    dt{
      width: 40%;
      img{
        width: 100%;
      }
    }
    .title{
      font-size: 20px;
      position: absolute;
      left: 35%;
      top: 0;
    }
    .user{
      color: #B3B3B3;
      position: absolute;
      left: 35%;
      top: 50%;
    }
    .collect{
      color: #b3b3b3;
      position: absolute;
      left: 35%;
      bottom: 0;
      span{
        display: inline-block;
        position: relative;
        left: 40%;
      }
    }
  }
}
</style>
