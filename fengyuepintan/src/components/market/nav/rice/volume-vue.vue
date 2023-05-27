<template>
  <div class="volume-container">
    <Classify :title="title" :list="list[1]"></Classify>
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
.volume-container{

}
</style>
