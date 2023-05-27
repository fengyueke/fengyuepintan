<template>
  <div class="news-container">
    <Navbar :title="title"></Navbar>
    <van-cell v-for="(item,index) in icon" :key="index"  :title="item.title" :icon="item.icon">
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
       <van-icon name="arrow" class="arrow" />
      </template>
    </van-cell>
    <div class="activity">
      <div class="title">
        <van-cell title="活动商品" icon="http://localhost/app/thumb.php?img=/i/2023/04/01/kotlus.png" />
      </div>
      <div class="content" v-for="item in list" :key="item.id">
        <div class="banner"><img :src="item.banner" alt=""></div>
        <div class="text">
          <p>#热门活动#{{ item.content }}</p>
          <p>{{item.time}}结束</p>
        </div>
      </div>
    </div>
  </div>
</template>
<van-icon name="envelop-o" />
<script>
import Navbar from '@/components/Navbar-vue.vue'

export default {
  data () {
    return {
      title: '消息',
      icon: [
        { icon: 'comment-o', title: '评论' },
        { icon: 'star-o', title: '收藏和赞' },
        { icon: 'friends-o', title: '新的粉丝' },
        { icon: 'envelop-o', title: '官方通知' }
      ],
      list: [],
      page: 1,
      limit: 10
    }
  },
  methods: {
    async getHotAction () {
      const { data: res } = await this.$http.get('/my/getHotAction', { params: { page: this.page, limit: this.limit } })
      console.log(res)
      if (res.status === 200) {
        this.list = [...this.list, ...res.data]
        this.loading = false
        if (res.data.length === 0) {
          this.finished = true
        }
      }
    },
    onload () {
      this.loading = false
      console.log('触发了onload')
      this.page++
      this.getHotAction()
    }
  },
  created () {
    this.getHotAction()
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
.news-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-cell{
    font-size: 20px;
  }
  /deep/.van-cell__left-icon, .van-cell__right-icon{
    font-size: 25px;
  }
  .activity{
    margin-top: 10px;
    .content{
      margin-bottom: 10px;
      background: #fff;
      .banner{
        img{
          width: 100%;
        }
      }
      .text{
        p{
          margin: 0;
          margin-left: 15px;
        }

        :nth-child(1){
          color: #7A7A7A;
          font-size: 17px;
        }
        :nth-child(2){
          color: #BDBDBD;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
