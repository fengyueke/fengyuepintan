<template>
  <div class="zongHe-container">
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
import Init from './init-vue.vue'
export default {
  data () {
    return {
      page: 1,
      limit: 8,
      loading: true,
      finished: false,
      list: []
    }
  },
  methods: {
    async getMonth () {
      const { data: res } = await this.$http.get('/my/getMarketMonth', { params: { page: this.page, limit: this.limit } })
      // console.log(res)
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
        this.getMonth()
      }, 1000)
    }
  },
  created () {
    this.getMonth()
  },
  components: {
    Init
  }
}
</script>

<style lang="less" scoped>
.zongHe-container{

}
</style>
