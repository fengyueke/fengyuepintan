
<template>
  <div class="desc-container">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
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
      limit: 10,
      list: [],
      loading: true,
      finished: false,
      desc: true
    }
  },
  methods: {
    async getPrice () {
      const { data: res } = await this.$http.get('/my/getMarketPrice', { params: { page: this.page, limit: this.limit, desc: this.desc } })
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
        this.getPrice()
      }, 1000)
    }
  },
  created () {
    this.getPrice()
  },
  components: {
    Init
  }
}
</script>

<style lang="less" scoped>
.desc-container{}
</style>
