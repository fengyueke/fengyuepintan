<template>
<div class="setPhone-container">
  <Navbar :title="title"></Navbar>
    <div class="icon"><img src="http://localhost/app/thumb.php?img=/i/2023/04/04/ib96rq.jpg"></div>
    <van-form @submit="onSubmit">
  <van-field
    v-model="phone"
    name="新手机号"
    label="新手机号"
    placeholder="新手机号"
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

  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">修改</van-button>
  </div>
</van-form>
</div>
</template>

<script>
import qs from 'qs'
import Navbar from '@/components/Navbar-vue.vue'
export default {
  data () {
    return {
      title: '修改手机号',
      phone: '',
      verify: '',
      randmon: '',
      limiting: 0,
      time: 59,
      disabled: false,
      token: ''
    }
  },
  methods: {
    onSubmit (values) {
      this.verify = parseInt(this.verify)
      if (this.verify !== this.randmon) {
        return alert('请输入正确的验证码')
      }
      console.log('submit', values)
      this.upPhone()
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
    async upPhone () {
      const data = qs.stringify({ phone: this.phone })
      const { data: res } = await this.$http({
        url: '/api/upphone',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status === 200) {
        alert('修改成功！请重新登录')
        this.$router.replace('/login')
      }
    }
  },
  created () {
    const token = localStorage.getItem('fengyuepintan')
    this.token = token
    if (token === null || token === '') {
      alert('请先登录')
      this.$router.push('/login')
    }
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
.setPhone-container{
  margin-top: 46px;
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
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
}
</style>
