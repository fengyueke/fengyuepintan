<template>
  <div class="searchUser-container">
    <van-cell-group>
      <van-cell title="添加通讯录好友" icon="http://localhost/app/thumb.php?img=/i/2023/03/30/ivf8c8.png">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
        <van-icon name="arrow" class="arrow-icon" />
        </template>
      </van-cell>
      <van-cell title="添加新浪微博好友" icon="http://localhost/app/thumb.php?img=/i/2023/03/30/ivf813.png">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
        <van-icon name="arrow" class="arrow-icon" />
        </template>
      </van-cell>
      <van-cell title="添加微信好友" icon="http://localhost/app/thumb.php?img=/i/2023/03/30/ivf29a.png">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
        <van-icon name="arrow" class="arrow-icon" />
        </template>
      </van-cell>
    </van-cell-group>
    <div class="active">
      <div class="title">活跃达人</div>
      <dl v-for="item in list" :key="item.uid">
        <dt><img :src="item.headerPh" alt=""></dt>
        <dd>{{ item.nickname }}</dd>
      </dl>
    </div>
    <OldData :locLis="locList"></OldData>
  </div>
</template>

<script>
import OldData from '@/components/oldData/oldData-vue.vue'

export default {
  data () {
    return {
      list: [],
      locList: []
    }
  },
  methods: {
    async getActiveUser () {
      const { data: res } = await this.$http.get('/my/active')
      if (res.status === 200) {
        this.list = [...res.data]
      }
    }
  },
  created () {
    if (localStorage.getItem('pastUser') !== '') {
      this.locList = JSON.parse(localStorage.getItem('pastUser'))
    }
    this.getActiveUser()
  },
  components: {
    OldData
  }
}
</script>

<style lang="less" scoped>
.searchUser-container{
  background: #f5f5f5;
  /deep/.van-icon__image{
    height: 1.5em;
  }
  /deep/.van-cell{
    border-bottom: 1px solid gray;
  }
  .active{
    .title{
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      padding-left: 15px;
    }
    dl{
      display: inline-block;
      text-align: center;
      width: 20%;
      dt{
        margin: 0;
       img{
        margin: 0 auto;
        width: 80%;
        border-radius: 50%;
      }
    }
    dd{
      margin: 0;
    }
    }

  }
}
</style>
