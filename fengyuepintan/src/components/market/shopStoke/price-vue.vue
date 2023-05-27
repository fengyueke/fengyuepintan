<template>
  <div class="price-container">
  <DescVue v-if="$store.state.isDesc" ></DescVue>
  <NoDesc v-else></NoDesc>
</div>
</template>

<script>
import DescVue from './desc-vue.vue'
import NoDesc from './noDesc-vue.vue'
export default {
  components: {
    DescVue,
    NoDesc
  }
}
</script>

<style lang="less" scoped>
.price-container{}
</style>
