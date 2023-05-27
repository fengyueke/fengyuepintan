<template>
  <div class="price-container">
    <DescVue :title="title" :list="list[2]" :isDesc="true" v-if="$store.state.riceIsDesc"></DescVue>
    <NoDescVue :title="title" :list="list[2]" :isDesc="false" v-if="!$store.state.riceIsDesc"></NoDescVue>
  </div>
</template>

<script>
import DescVue from './desc-vue.vue'
import NoDescVue from './noDesc-vue.vue'

export default {
  props: ['title', 'list'],
  data () {
    return {
    }
  },
  components: {
    DescVue,
    NoDescVue
  }
}
</script>

<style lang="less" scoped>
.price-container{

}
</style>
