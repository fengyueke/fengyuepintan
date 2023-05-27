<template>
  <div class="volume-container">
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
import Init from '../init-vue.vue'
export default {
  data () {
    return {
      page: 1,
      limit: 10,
      list: [],
      loading: true,
      finished: false
    }
  },
  methods: {
    async getVolume () {
      const { data: res } = await this.$http.get('/my/getMarketStoke', { params: { page: this.page, limit: this.limit, classify: 'volume', id: this.$route.params.id } })
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
        this.getVolume()
      }, 1000)
    }
  },
  created () {
    this.getVolume()
  },
  components: {
    Init
  }
}
</script>

<style lang="less" scoped>
.volume-container{}
</style>
