<template>
  <div class="searchMenu-container">
    <van-notice-bar mode="closeable">试试搜索多个食材</van-notice-bar>
    <div class="hotSearch">
      <div class="title">热门搜索</div>
      <van-grid :column-num="3">
        <van-grid-item v-for="value in hotList"  @click="toMenu(value)" :key="value.id"  :text="value.title" />
      </van-grid>
    </div>
    <OldData :locLis="locList"></OldData>
    <!-- <div class="oldData">
      <div class="title">搜索历史 <span @click="clearLoc">清空</span></div>
      <van-cell-group>
        <van-cell v-for="(item,index) in locList" :key="index" :title="item" />
      </van-cell-group>
    </div> -->
  </div>
</template>

<script>
import OldData from '@/components/oldData/oldData-vue.vue'

export default {
  data () {
    return {
      hotList: [],
      locList: []
    }
  },
  methods: {
    async getHotSearch () {
      const { data: res } = await this.$http.get('/my/hotSearch')
      if (res.status === 200) {
        this.hotList = [...res.data]
      }
    },
    toMenu (data) {
      this.$store.commit('addDetailTitle', data.title)
      this.$store.commit('addDetailId', data.id)
      this.$router.push('/details')
    }
  },
  created () {
    if (localStorage.getItem('pastMenu') !== '') {
      this.locList = JSON.parse(localStorage.getItem('pastMenu'))
    }
    this.getHotSearch()
  },
  components: {
    OldData
  }
}
</script>

<style lang="less" scoped>
.searchMenu-container{
  background: #f5f5f5;
  /deep/.van-notice-bar{
    color: #fff;
    background: rgba(153, 153, 153,50%);
  }
  .hotSearch{
    .title{
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      padding-left: 15px;
    }
  }
  .oldData{
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
}
</style>
