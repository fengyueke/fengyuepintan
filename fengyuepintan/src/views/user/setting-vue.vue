<template>
  <div class="setting-container">
    <van-nav-bar title="设置"  @click-left="$router.back()" >
      <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
    </van-nav-bar>
    <van-cell-group inset clickable>
      <van-cell class="user" to="/setuser" :icon="headerPh" :title="nickname"  is-link/>
      <van-cell @click="toPage" v-for="(item,index) in list" :id="index" :key="item" :title="item"  is-link/>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: ['消息推送', '账号授权', '新的粉丝', '同步共享', '分享应用给好友', '应用推荐', '意见反馈', '清理缓存', '版本检测'],
      nickname: '',
      headerPh: '',
      token: ''
    }
  },
  methods: {
    async getInfo () {
      const { data: res } = await this.$http.get('/my/myinfo', { headers: { authorization: this.token } })
      if (res.status === 200) {
        this.headerPh = res.data.headerPh
        this.nickname = res.data.nickname
      } else if (res.msg === 'jwt expired') {
        alert('登录过期，请先登录')
      } else if (res.msg === '系统繁忙，请稍后再试') {
        alert('系统繁忙，请重新登录')
        this.$router.push('/login')
      } else {
        alert(res.msg)
      }
    },
    toPage (e) {
      let temp = e.srcElement.offsetParent.id
      temp = parseInt(temp)
      switch (temp) {
        case 0:
          this.$router.push('/setnews')
          break
      }
    }
  },
  created () {
    this.token = localStorage.getItem('fengyuepintan')
    if (this.token === null || this.token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.getInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.setting-container{
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-cell__left-icon, .van-cell__right-icon{
    font-size: 25px;
  }
  /deep/.van-cell{
    border-bottom: 5px solid #f5f5f5;
  }
  .user{
    height: 60px;
    /deep/.van-icon__image{
      width: 1.5em;
      height: 1.5em;
      border-radius: 50%;
    }
    /deep/.van-cell__title, .van-cell__value{
      line-height: 40px;
    }
  }
}
</style>
