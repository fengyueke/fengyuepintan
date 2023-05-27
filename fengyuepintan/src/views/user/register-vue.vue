<template>
  <div class="register-container">
    <van-nav-bar title="注册" @click-left="$router.back()">
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
    placeholder="手机号"
    :rules="[{ required: true, message: '请填写手机号' }]"
  />
  <van-field
  v-model="verify"
  center
  clearable
  label="验证码"
  placeholder="请输入短信验证码"
>
  <template #button>
    <van-button size="small" :disabled="disabled"  @click="send" native-type="button" type="primary">发送验证码</van-button>
  </template>
</van-field>
<van-field
    v-model="nickname"
    name="昵称"
    label="昵称"
    placeholder="昵称"
    :rules="[{ required: true, message: '请填写昵称' }]"
  />
  <van-field
    v-model="password"
    :type="type"
    name="设置密码"
    label="设置密码"
    :right-icon="show"
    @click-right-icon="isShow"
    placeholder="密码"
    :rules="[{ required: true, message: '请填写密码' }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">注册</van-button>
  </div>
  <van-checkbox v-model="checked">以阅读并同意风月<a>用户协议</a>和<a>条款</a></van-checkbox>
</van-form>
 </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      phone: '',
      nickname: '',
      password: '',
      verify: '',
      randmon: '',
      limiting: 0,
      time: 59,
      disabled: false,
      checked: true,
      show: 'eye-o',
      type: 'password'
    }
  },
  methods: {
    onSubmit (values) {
      this.verify = parseInt(this.verify)
      if (this.verify !== this.randmon) {
        return alert('请输入正确的验证码')
      }
      const t = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/
      const flag = t.test(this.password)
      if (!flag) {
        return alert('密码要包括大写字母，小写字母，数字，特殊符号中的任意三项')
      }
      if (this.password.length < 6 || this.password.length > 15) {
        return alert('密码要在6~15位之间')
      }
      this.register()
    },
    send (e) {
      if (this.phone.length !== 11) {
        return alert('请输入正确的手机号')
      }
      this.time = 59
      this.randmon = Math.random() * 999999
      this.randmon = parseInt(this.randmon)
      this.limiting++
      if (this.limiting > 3) {
        return alert('次数已用完，明天再试吧')
      }
      const timer = setInterval(() => {
        this.time--
        e.target.innerText = `${this.time}秒后重新发送`
        this.disabled = true
        if (this.time <= 0) {
          e.target.innerText = '重新发送验证码'
          this.disabled = false
          clearInterval(timer)
        }
      }, 1000)
      return alert(this.randmon)
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
    async register () {
      const data = qs.stringify({ phone: this.phone, nickname: this.nickname, password: this.password })
      const { data: res } = await this.$http.post('/my/register', data)
      if (res.status === 200) {
        alert('注册成功，前往登录')
        this.$router.replace('/login')
      } else {
        alert(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.register-container{
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
  /deep/.van-checkbox{
    justify-content: center;
  }
  /deep/.van-checkbox__label{
    a{
      color: #8680BF;
    }
  }
}
</style>
