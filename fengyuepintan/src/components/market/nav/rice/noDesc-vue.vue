<template>
  <div class="classify-container">
    <div ref="classify" class="classify">
      <van-grid :gutter="10" :column-num="5">
        <van-grid-item v-for="(item,index) in classify" :key="item" :text="item" @click="classifyTab(index)" />
      </van-grid>
    </div>
    <keep-alive>
    <component :is="comName" :title="title" :classify="classify" :nav="list" :isDesc="isDesc"></component>
    </keep-alive>
  </div>
</template>

<script>
import All from './riceZongHe/all-vue.vue'
import Ganhuo from './riceZongHe/ganhuo-vue.vue'
import Rice from './riceZongHe/rice-vue.vue'
import Fast from './riceZongHe/fast-vue.vue'
import Rest from './riceZongHe/rest-vue.vue'

export default {
  props: ['title', 'list', 'isDesc'],
  data () {
    return {
      comName: 'All',
      classify: []
    }
  },
  methods: {
    classifyTab (id) {
      const t = this.$refs.classify.childNodes[0].childNodes
      for (let i = 0; i < t.length; i++) {
        if (i === id) {
          t[i].childNodes[0].lastChild.style.color = '#FEA662'
        } else {
          t[i].childNodes[0].lastChild.style.color = '#646566'
        }
      }
      switch (id) {
        case 0:
          this.comName = 'All'
          break
        case 1:
          this.comName = 'Ganhuo'
          break
        case 2:
          this.comName = 'Rice'
          break
        case 3:
          this.comName = 'Fast'
          break
        case 4:
          this.comName = 'Rest'
          break
      }
    }
  },
  created () {
    if (this.title === '米面粮油') {
      this.classify = ['全部', '南北干货', '米面油', '方便速食', '其他']
    } else if (this.title === '果蔬生鲜') {
      this.classify = ['全部', '水果蔬菜', '生肉类', '水产品', '其他']
    } else if (this.title === '厨房电器') {
      this.classify = ['全部', '制备类', '准备类', '烹饪类', '其他']
    } else if (this.title === '养生食材') {
      this.classify = ['全部', '酒类', '茶类', '药材', '其他']
    }
  },
  mounted () {
    if (this.title !== '调味品' && this.title !== '厨房餐具') {
      this.$refs.classify.childNodes[0].childNodes[0].childNodes[0].lastChild.style.color = '#FEA662'
    }
    // this.$refs.classify.childNodes[0].childNodes[0].childNodes[0].lastChild.style.color = '#FEA662'
  },
  components: {
    All,
    Ganhuo,
    Rice,
    Fast,
    Rest
  }
}
</script>
<style lang="less" scoped>
  .classify-container{
    margin: 10px 0;
      /deep/.van-grid-item__text{
      font-size: 12px;
    }
    /deep/ .van-grid-item__content{
      padding: 10px 6px;
    }
  }
</style>
