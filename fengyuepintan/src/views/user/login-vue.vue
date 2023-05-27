<template>
  <div class="login-container">
    <van-nav-bar title="登录"  @click-left="$router.back()" >
      <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
    </van-nav-bar>
    <div class="icon"><img src="http://localhost/app/thumb.php?img=/i/2023/04/04/ib96rq.jpg"></div>
    <van-form @submit="onSubmit">
  <van-field
    v-model="phone"
    name="手机号"
    label="手机号"
    left-icon="manager-o"
    placeholder="手机号"
    :rules="[{ required: true, message: '请填写手机号' }]"
  />
  <van-field
    v-model="password"
    :type="type"
    name="密码"
    label="密码"
    left-icon="http://localhost/i/2023/04/11/h0vxd2.png"
    :right-icon="show"
    @click-right-icon="isShow"
    placeholder="密码"
    :rules="[{ required: true, message: '请填写密码' }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">提交</van-button>
  </div>
</van-form>
<div class="active">
  <ul>
    <li @click="$router.push('/register')">注册账号</li>
    <li  class="fen"></li>
    <li @click="$router.push('/forget')" >忘记密码</li>
  </ul>
</div>
<div class="san">
  <div class="title">
    <hr>
    <span>第三方登录</span>
    <hr>
  </div>
  <div class="url">
    <ul>
      <li><img src="http://localhost/app/thumb.php?img=/i/2023/04/12/gw6bf6.jpg" alt=""></li>
      <li><img src="http://localhost/app/thumb.php?img=/i/2023/04/12/gvdwo2.png" alt=""></li>
      <li><img src="http://localhost/app/thumb.php?img=/i/2023/04/12/gtuos1.jpg" alt=""></li>
    </ul>
  </div>
</div>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  data () {
    return {
      phone: '',
      password: '',
      show: 'eye-o',
      type: 'password'
    }
  },
  methods: {
    onSubmit (values) {
      this.login()
    },
    isShow () {
      if (this.show === 'eye-o') {
        this.show = 'closed-eye'
        this.type = 'text'
      } else {
        this.show = 'eye-o'
        this.type = 'password'
      }
    },
    async login () {
      const { data: res } = await this.$http.post('/my/login', qs.stringify({ phone: this.phone, password: this.password }))
      if (res.status === 200) {
        localStorage.setItem('fengyuepintan', res.token)
        this.$router.replace('/user')
      } else if (res.msg === '账号未注册，是否前往注册') {
        const flag = confirm('账号未注册，是否前往注册')
        if (flag) {
          this.$router.push('/register')
        }
      } else {
        alert(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  background: #f5f5f5;
  /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-nav-bar__title{
    font-size: 18px;
  }
  .icon{
    height: 360px;
    position: relative;
    img{
      border-radius: 19px;
      width: 120px;
      justify-content: center;
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
  }
  /deep/.van-button--info{
    color: #000;
    background: #ffdd00;
    border: 1px solid #ffdd00;
  }
  .active{
    color: gray;
    height: 30px;
    position: relative;
    li{
      margin: 0 5px;
    float: right;
    }
    .fen{
      width: 1px;
      height: 16px;
      margin-top: 3px;
      background: gray;
    }
  }
  .san{
    height: 30px;
    position: relative;

    .title{
      height: 30px;
      margin-left: 15%;
      hr{
      width: 30%;
      float: left;
    }
    span{
      font-size: 12px;
      margin: 0 5px;
      float: left;
    }
    }
    .url{
      background: #f5f5f5;
      height:40px;
      position: relative;
      ul{
        display: flex;
        justify-content: space-around;
      }
      li{
        width: 10%;
        float: left;
        img{
          border-radius: 50%;
          width: 100%;
        }
      }
    }

  }
}
</style>
