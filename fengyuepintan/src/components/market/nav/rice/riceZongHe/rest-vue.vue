<template>
  <div class="all-container">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
  <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
    <Init :zList="list"></Init>
  </van-list>
  </div>
</template>

<script>
import Init from '@/components/market/init-vue.vue'
export default {
  props: ['title', 'classify', 'nav', 'isDesc'],
  data () {
    return {
      page: 1,
      limit: 10,
      loading: true,
      finished: false,
      list: []
    }
  },
  methods: {
    async getRice () {
      const { data: res } = await this.$http.get('/my/getMarketRice', { params: { page: this.page, limit: this.limit, title: this.title, classify: this.classify[4], nav: this.nav, isDesc: this.isDesc } })
      if (res.status === 200) {
        this.list = [...this.list, ...res.data]
        this.loading = false
        if (res.data.length === 0) {
          this.finished = true
        }
      }
    },
    onLoad () {
      setTimeout(() => {
        this.loading = true
        this.page++
        if (this.page === 1) {
          return
        }
        this.getRice()
      }, 1000)
    }
  },
  created () {
    this.getRice()
  },
  components: {
    Init
  }
}
</script>

<style lang="less" scoped>
.all-container{

}
</style>
