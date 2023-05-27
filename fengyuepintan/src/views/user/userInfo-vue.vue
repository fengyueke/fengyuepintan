<template>
  <div class="userInfo-container">
    <van-nav-bar title="我的" left-arrow @click-left="$router.back()" @click-right="setting">
      <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
      <template #right>
        <van-icon name="setting-o" size="25" />
      </template>
  </van-nav-bar>
  <div class="top">
    <div class="user">
      <div class="title">
        <dl>
          <dt><img :src="headerPh" alt=""></dt>
          <dd>{{ nickname }}</dd>
        </dl>
      </div>
   </div>
   <div class="info">
    <div class="sex"><van-tag plain type="primary" size="medium"><van-icon name="http://localhost/app/thumb.php?img=/i/2023/04/06/it68kl.png" />厨娘</van-tag></div>
    <div class="num">
      <dl>
        <dt>{{ watch }}</dt>
        <dd>关注</dd>
      </dl>
      <dl>
        <dt>{{ fans }}</dt>
        <dd>粉丝</dd>
      </dl>
      <dl>
        <dt>{{ integral }}</dt>
        <dd>积分</dd>
      </dl>
    </div>
  </div>
  </div>
  <div class="main">
    <van-cell @click="toPage" v-for="(item,index) in list" :id="index" :key="item" :title="item">
    <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-icon name="arrow" class="arrow" size="25" />
      </template>
    </van-cell>
  </div>
  <div class="out">
  <van-button @click="loginout" round type="danger" >退出登录</van-button>
  </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      list: ['我的收藏', '我的菜谱', '我的订单', '购物车', '我的关注', '我的积分', '我的粉丝'],
      token: '',
      watch: 0,
      fans: 0,
      integral: 0,
      headerPh: '',
      nickname: ''
    }
  },
  methods: {
    async getInfo () {
      const { data: res } = await this.$http.get('/my/myinfo', { headers: { authorization: this.token } })
      if (res.status === 200) {
        if (res.data.watchlist !== null) {
          const wList = res.data.watchlist.split(',')
          this.watch = (wList.length)
        }
        if (res.data.fans !== null && res.data.fans !== '') {
          const fans = res.data.fans.split(',')
          this.fans = fans.length
        }
        this.integral = res.data.integral
        this.headerPh = res.data.headerPh
        this.nickname = res.data.nickname
      } else if (res.msg === 'jwt expired') {
        alert('登录授权过期，请重新登录')
        this.$router.replace('/login')
      } else if (res.msg === '系统繁忙，请稍后再试') {
        alert('系统繁忙，请重新登录')
        this.$router.push('/login')
      }
    },
    setting () {
      this.$router.push('/setting')
    },
    toPage (e) {
      let id = -1
      if (e.target._prevClass === 'van-cell__title') {
        id = e.srcElement.offsetParent.id
      } else if (e.target._prevClass === 'van-cell') {
        id = e.target.id
      }
      id = parseInt(id)
      switch (id) {
        case 0:
          this.$router.push('/myCollect')
          break
        case 1:
          this.$router.push('/myMenu')
          break
      }
    },
    loginout () {
      localStorage.setItem('fengyuepintan', '')
      this.$router.replace('/login')
    }
  },
  created () {
    const token = localStorage.getItem('fengyuepintan')
    this.token = token
    if (token === null || token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.getInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.userInfo-container{
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  .top{
    position: relative;
    padding-left: 15%;
    .user{
    .title{
      dl{
        width: 100px;
        text-align: center;
        dt{
          width: 100%;
          img{
            width: 100%;
            border-radius: 50%;
          }
        }
        dd{
          margin: 0;
        }
      }
    }
  }
  .info{
    position: absolute;
    left: 45%;
    top: 50px;
    .sex{
      /deep/.van-tag--primary.van-tag--plain{
        color: #000;
      }
      /deep/.van-tag--plain::before{
        border: 1px solid gray;
      }
    }
    .num{
      dl{
        float: left;
        width: 50px;
        text-align: center;
        dt{
          color: #FD730F;
          width: 100%;
        }
        dd{
          font-size: 12px;
          margin: 0;
        }
      }
    }
  }
  }
  .main{
    /deep/.van-cell{
      font-size: 16px;
      margin-bottom: 5px;
    }
  }
  .out{
    /deep/.van-button--normal{
    width: 74%;
    margin-left: 15%;
    margin-top: 10px;
  }
  }

}
</style>
