<template>
  <div class="zongHe-container">
    <Classify :title="title" :list="list[0]"></Classify>
  </div>
</template>

<script>
import Classify from './classify-vue.vue'

export default {
  props: ['title', 'list'],
  data () {
    return {
    }
  },
  components: {
    Classify
  }
}
</script>

<style lang="less" scoped>
.zongHe-container{

}
</style>
