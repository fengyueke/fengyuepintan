<template>
  <div class="null-container">

  </div>
</template>

<script>
export default {
  created () {
    console.log(this.$route.params.path)
    if (this.$route.params.path) {
      this.$router.replace('/details/menu')
    } else {
      this.$router.replace('/dynamic')
    }
  }
}
</script>

<style lang="less" scoped>
.null-container{

}
</style>
