<template>
  <div class="timer-container">
    <Classify :title="title" :list="list[3]"></Classify>
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
.timer-container{

}
</style>
