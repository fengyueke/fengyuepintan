<template>
  <div class="sethp-container">
    <van-nav-bar title="个人基本信息" right-text="保存" @click-right="save"  @click-left="back" >
      <template #left>
        <van-icon name="arrow-left" size="25" />
      </template>
    </van-nav-bar>
    <div class="hp">
      <img :src="headerPh" @click="phShow=true">
      <i></i>
    </div>
    <!-- <van-action-sheet close-on-popstate  v-model="phShow" :actions="phActions" @select="onPhSelect" /> -->
    <van-action-sheet close-on-popstate  v-model="phShow" title="可选头像" >
      <van-list
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      v-model="loading"
      >
      <img @click="activeHp"  v-for="(item) in phActions" :id="item.id" :key="item.id" v-lazy="item.headerPh" alt="">
    </van-list>

    </van-action-sheet>
    <van-cell-group inset>
      <van-cell title="昵称" :value="nickname" @click="isSetNick" />
      <input type="text" ref="ipt" @blur="isSetName" v-model="nickname" class="ipt">
      <van-cell title="性别" :value="sex"  @click="sexShow = true"/>
      <van-action-sheet v-model="sexShow"  close-on-click-action :actions="sexActions" @select="onSexSelect" />
      <van-cell title="生日" :value="birthday" @click="isSetBtd" />
      <input type="text" ref="birthday" @blur="isBtd" v-model="birthday" class="birthday">
      <van-cell title="个性签名" :value="sign" @click="isSetSign" />
      <input type="text" v-model="sign" ref="sign" @blur="isSign" class="sign">
    </van-cell-group>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import qs from 'qs'
export default {
  data () {
    return {
      headerPh: '',
      hpId: -1,
      bakHeaderPh: '',
      phShow: false,
      phActions: [],
      nickname: '风月',
      bakNickname: '',
      sex: '',
      bakSex: '',
      sexShow: false,
      sexActions: [{ name: '男' }, { name: '女' }, { name: '保密' }],
      birthday: '',
      newDate: '',
      bakBirthday: '',
      sign: '',
      bakSign: '',
      token: '',
      page: 1,
      limit: 3,
      loading: false,
      finished: false,
      isSave: true,
      success: []
    }
  },
  methods: {
    async setHp () {
      const data = qs.stringify({ id: this.hpId })
      const { data: res } = await this.$http({
        url: '/api/upHp',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status !== 200) return (alert(res.msg))
      this.success.push(true)
    },
    async setNick () {
      const data = qs.stringify({ nickname: this.nickname })
      const { data: res } = await this.$http({
        url: '/api/upName',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status !== 200) return (alert(res.msg))
      this.success.push(true)
    },
    async setSex () {
      const data = qs.stringify({ sex: this.sex })
      const { data: res } = await this.$http({
        url: '/api/upSex',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status !== 200) return (alert(res.msg))
      this.success.push(true)
    },
    async setBtd () {
      const data = qs.stringify({ birthday: this.birthday })
      const { data: res } = await this.$http({
        url: '/api/upBtd',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status !== 200) return (alert(res.msg))
      this.success.push(true)
    },
    async setSign () {
      const data = qs.stringify({ sign: this.sign })
      const { data: res } = await this.$http({
        url: '/api/upSign',
        method: 'POST',
        headers: {
          authorization: this.token
        },
        data
      })
      if (res.status !== 200) return (alert(res.msg))
      this.success.push(true)
    },
    async getHp () {
      // const data = qs.stringify({ page: this.page, limit: this.limit })
      const { data: res } = await this.$http({
        url: '/api/getHeaderPh',
        method: 'GET',
        headers: {
          authorization: this.token
        },
        params: {
          page: this.page,
          limit: this.limit
        }
      })
      if (res.status === 200) {
        this.phActions = [...this.phActions, ...res.data]
        this.loading = false
        if (res.data.length === 0) {
          this.finished = true
        }
      } else {
        alert(res.msg)
      }
    },
    async getMyInfo () {
      const { data: res } = await this.$http.get('/my/myinfo', { headers: { authorization: this.token } })
      if (res.status === 200) {
        if (res.data.birthday !== null) {
          this.birthday = res.data.birthday
          this.bakBirthday = this.birthday
        } else {
          this.birthday = '无'
        }
        this.sex = res.data.sex
        this.bakSex = this.sex
        this.nickname = res.data.nickname
        this.bakNickname = this.nickname
        this.sign = res.data.signature
        this.bakSign = this.sign
        this.headerPh = res.data.headerPh
        this.bakHeaderPh = this.headerPh
      } else {
        alert(res.msg)
      }
    },
    activeHp (e) {
      this.hpId = e.target.id
      this.headerPh = e.target.src
      this.isSave = false
      this.phShow = false
    },
    isSetNick () {
      this.$refs.ipt.style.display = 'inline-block'
      this.isSave = false
      this.nickname = ''
      this.$refs.ipt.focus()
    },
    isSetName (e) {
      if (this.nickname === '') {
        this.nickname = this.bakNickname
      }
      e.target.style.display = 'none'
    },
    onSexSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.sex = item.name
      this.isSave = false
      this.sexShow = false
    },
    isSetBtd () {
      this.$refs.birthday.style.display = 'inline-block'
      this.isSave = false
      this.birthday = ''
      this.$refs.birthday.focus()
    },
    isBtd (e) {
      if (this.birthday === '') {
        this.birthday = this.bakBirthday
        e.target.style.display = 'none'
        return
      } else if (this.birthday === '无') {
        this.birthday = '无'
        e.target.style.display = 'none'
        return
      }
      const t = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/
      const flag = t.test(this.birthday)
      if (!flag) {
        return alert('必须是' + this.newDate + '这种格式，若不想填写生日，写入无')
      }
      e.target.style.display = 'none'
    },
    isSetSign () {
      this.$refs.sign.style.display = 'inline-block'
      this.isSave = false
      this.sign = ''
      this.$refs.sign.focus()
    },
    isSign (e) {
      if (this.sign.length > 30) {
        return alert('字数不能超过30')
      }
      if (this.sign === '') {
        this.sign = this.bakSign
      }
      e.target.style.display = 'none'
    },
    onLoad () {
      this.loading = false
      console.log('触发了onload')
      this.page++
      this.getHp()
    },
    save () {
      let temp = 0
      if (this.headerPh !== this.bakHeaderPh) {
        temp++
        this.setHp()
      }
      if (this.nickname !== this.bakNickname) {
        temp++
        this.setNick()
      }
      if (this.sex !== this.bakSex) {
        temp++
        this.setSex()
      }
      if (this.birthday !== this.bakBirthday) {
        temp++
        this.setBtd()
      }
      if (this.sign !== this.bakSign) {
        temp++
        this.setSign()
      }
      if (temp !== this.success.length) {
        return
      }
      this.isSave = true
      alert('保存成功')
    },
    back () {
      if (this.isSave) return this.$router.back()
      const flag = confirm('还未保存，是否保存？')
      if (!flag) return this.$router.back()
      this.save()
    }
  },
  created () {
    const token = localStorage.getItem('fengyuepintan')
    this.token = token
    if (token === null || token === '') {
      alert('请先登录')
      this.$router.push('/login')
    } else {
      this.getMyInfo()
    }
    const year = dayjs().year()
    let month = dayjs().month()
    let date = dayjs().date()
    month = month + 1
    month = month > 9 ? month : '0' + month
    date = date > 9 ? date : '0' + date
    this.newDate = year + '-' + month + '-' + date
    this.getHp()
  }
}

</script>

<style lang="less" scoped>
.sethp-container{
  min-height: 100vh;
  background: #f5f5f5;
  /deep/.van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-nav-bar__text{
    font-size: 16px;
    color: #000;
  }
  /deep/.van-action-sheet__content{
    text-align: center;
  }
  .hp{
    margin: 20px 0;
    text-align: center;
    img{
      width: 30%;
      border-radius: 50%;
    }
    i{
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('http://localhost/i/2023/04/16/m0ri1h.png');
      background-size: contain;
      transform: translate(-18px,3px);
    }
  }
  .ipt{
    display: none;
    position: absolute;
    right: 0;
    top: 10px;
    border: 0;
  }
  .birthday{
    display: none;
    position: absolute;
    right: 0;
    top: 98px;
    border: 0;
  }
  .sign{
    display: none;
    position: absolute;
    right: 0;
    top: 145px;
    border: 0;
  }
}
</style>
