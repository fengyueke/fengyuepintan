<template>
  <div class="homepage-container">
    <!-- 顶部 -->
  <van-nav-bar   @click-left="onClickLeft"  @click-right="onClickRight">
    <template #left>
      <van-icon name="apps-o" size="18"/>
    </template>
    <template #title>
        <van-search @click="toSearch" shape="round" disabled background="0" placeholder="请输入搜索关键词" />
    </template>
    <template #right>
      <van-icon name="chat-o" size="18"/>
    </template>
  </van-nav-bar>

  <van-pull-refresh v-model="isLoading" :disabled="finished" @refresh="onRefresh">
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
  <div v-for="(item,index) in sumArr" :key="index" class="banner" @click="toMenu(item)">
      <img class="focus" :src="item.url" alt="">
      <div class="title">
        {{ item.title }}
      </div>
      <div class="user">
        <img :src="item.headerPh" alt="">
        <span>{{ item.nickname }}</span>
      </div>
    </div>
  </van-list>
</van-pull-refresh>

  <!-- 底部 -->

  </div>

</template>

<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      sumArr: [],
      page: 1,
      limit: 2,
      loading: true,
      finished: false,
      isLoading: false
    }
  },
  methods: {
    async getHomePage (isRefresh) {
      const { data: res } = await this.$http.get('/my/home', { params: { page: this.page, limit: this.limit } })
      if (res.status === 200) {
        if (isRefresh) {
          this.sumArr = [...res.data, ...this.sumArr]
          this.isLoading = false
        } else {
          this.sumArr = [...this.sumArr, ...res.data]
          this.loading = false
        }
        if (res.data.length === 0) {
          this.finished = true
        }
      }
    },
    async getUserInfo (id) {
      const { data: res } = await this.$http.get('/my/userInfo', { params: { id: id } })
      if (res.status === 200) {
        this.userId.push(res.data[0].id)
        this.headerPh.push(res.data[0].headerPh)
        this.nickname.push(res.data[0].nickname)
      }
    },
    toMenu (val) {
      this.$store.commit('addDetailTitle', val.title)
      this.$store.commit('addDetailId', val.id)
      this.$router.push('/details')
    },
    onClickLeft () {
      Toast('分类')
      this.$router.push('/classify')
    },
    onClickRight () {
      Toast('消息')
      this.$router.push('/news')
    },
    onLoad () {
      setTimeout(() => {
        this.loading = true
        this.page++
        this.getHomePage()
      }, 1000)
    },
    onRefresh () {
      this.isLoading = true
      this.page++
      this.getHomePage(true)
    },
    toSearch () {
      this.$router.push('/search')
    }
  },
  created () {
    this.getHomePage()
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
.homepage-container{
  margin-top: 46px;
  margin-bottom: 50px;
  /deep/ .van-nav-bar__content{
    position: fixed;
    width: 100%;
    top: 0;
    background: #ffdd00;
  }

  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-nav-bar__title{
    max-width: 80%;
  }
  /deep/.van-tabbar-item--active{
    color: #ffdd00;
  }
  .banner{
    position: relative;
    color: #fff;
    .focus{
      width: 100%;
    }
    .title{
      text-align: center;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: 20px;
    }
    .user{
      font-size: 14px;
      position: absolute;
      left: 50%;
      top: 55%;
      transform: translate(-50%,10px);
      img{
        width: 40px;
        border-radius: 50%;
      }
      span{
        display: inline-block;
        transform: translate(10px,-12px);
      }
    }
  }
  /deep/.van-grid{
    width: 100%;
    position: absolute;
    top: 53%;
  }
  /deep/.van-grid-item__content{
    background: #f5f5f5;
  }
}
</style>
