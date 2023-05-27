<template>
  <div class="dynamic-container">
    <Navbar :title="title"></Navbar>
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <div class="content" v-for="(item,index) in userList" :key="index">
      <div class="user">
        <img :src="item.hp" alt="">
        <span class="nickname">{{ item.nickname }}</span><br>
        <span class="publish">{{ item.time }}</span>
      </div>
      <div class="nei">
        <span>{{ menuList[index].introduce }}</span>
        <img :src="menuList[index].url" alt="">
      </div>
      <div class="like" @click="isLike(menuList[index].id)" v-if="!like[index]" ><van-icon :name="icon" /> {{ menuList[index].like }}</div>
      <div class="like" @click="isLike(menuList[index].id)" v-else><van-icon :name="icon2" /> {{ menuList[index].like }}</div>
      <div class="comment" @click="isShow(comment[index],menuList[index].id)"><van-icon name="chat-o" /> {{ comment[index].c.length }}</div>
      <van-action-sheet v-model="show" title="评论">
        <div class="ty">
                <div class="comment" v-for="item in cUserList" :key="item.id">
                  <div class="title">
                    <img :src="item.hp">
                    <span>{{ item.nickname }}</span>
                  </div>
                  <div class="matter">
                    <span>{{ '&nbsp;&nbsp;&nbsp;&nbsp;'+item.comment }}</span>
                  </div>
                  <div class="time">-{{ '-'+item.time }}</div>
                </div>
        </div>
        <div class="pubComment">
          <van-field
        v-model="sms"
        center
        clearable
        label="评论"
        placeholder="请输入内容"
        >
        <template #button>
          <van-button size="mini" round type="info" @click="commentSend(menuList[index].id)">发送</van-button>
        </template>
      </van-field>
        </div>

      </van-action-sheet>
    </div>
</van-list>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar-vue.vue'
import dayjs from 'dayjs'
import qs from 'qs'

export default {
  data () {
    return {
      sms: '',
      title: '动态',
      icon: 'like-o',
      icon2: 'http://localhost/i/2023/04/25/sh9c2q.png',
      token: '',
      watchList: [],
      likeList: [],
      userList: [],
      cUserList: [],
      menuList: [],
      comment: [],
      like: [],
      likeLength: [],
      page: 1,
      limit: 10,
      loading: true,
      finished: false,
      show: false,
      menuId: 0
    }
  },
  methods: {
    isLike (id) {
      this.updateLike(id)
    },
    async getMyInfo () {
      const { data: res } = await this.$http.get('/my/myinfo', { headers: { authorization: this.token } })
      if (res.status === 200) {
        this.watchList = res.data.watchlist.split(',')
        this.getDynamic(true)
      } else if (res.msg === 'jwt expired') {
        alert('请先登录')
        this.$router.push('/login')
      }
    },
    async getDynamic (flag) {
      const { data: res } = await this.$http.get('/my/getDynamic', { params: { page: this.page, limit: this.limit, watch: this.watchList }, headers: { authorization: this.token } })
      if (res.status === 200) {
        if (flag) {
          // console.log(res)
          this.loading = false
          if (res.data.length === 0) {
            this.finished = true
            return
          }
          this.watchList.forEach((item, index) => {
            item = parseInt(item)
            const tiem = dayjs(res.data[index].publishTime).format('YYYY-MM-DD HH:mm')
            this.getUserInfo(item, tiem)
          })
          res.data.forEach(item => {
            let length = item.likes.split(',')
            length = length.length
            this.menuList.push({ id: item.id, introduce: item.introduce, url: item.url, like: length })
          })
          this.like = res.arr
          res.data.forEach(item => {
            const arr = item.comment.split('&')
            const cid = item.commentId.split('&')
            const cTimer = item.commentTime.split('&')
            this.comment.push({ c: arr, cid: cid, ctimer: cTimer })
          })
        } else {
          this.page = 1
          this.loading = false
          if (res.data.length === 0) {
            this.finished = true
            return
          }
          this.like = res.arr
          this.menuList = []
          res.data.forEach(item => {
            let length = item.likes.split(',')
            length = length.length
            this.menuList.push({ id: item.id, introduce: item.introduce, url: item.url, like: length })
          })
        }
      }
    },
    async getUserInfo (_id, timer) {
      const { data: res } = await this.$http.get('/my/userInfo', { params: { uid: _id } })
      if (res.status === 200) {
        this.userList.push({ uid: res.data.uid, hp: res.data.headerPh, nickname: res.data.nickname, time: timer })
      }
    },
    async commentUser (_id, _time, _comment) {
      _time = dayjs(_time).format('YYYY-MM-DD HH:mm')
      const { data: res } = await this.$http.get('/my/userInfo', { params: { uid: _id } })
      if (res.status === 200) {
        this.cUserList.push({ uid: res.data.uid, nickname: res.data.nickname, hp: res.data.headerPh, time: _time, comment: _comment })
      }
    },
    async updateLike (_id) {
      const { data: res } = await this.$http.get('/my/updateDynamicLike', { params: { id: _id }, headers: { authorization: this.token } })
      if (res.status === 200) {
        // this.$router.replace('/null')
        this.getDynamic(false)
      }
    },
    async sendComment (info) {
      const data = qs.stringify({ id: this.menuId, comment: info })
      const { data: res } = await this.$http({
        url: '/api/sendCommend',
        method: 'post',
        data: data,
        headers: {
          authorization: this.token
        }
      })
      if (res.status === 200) {
        alert('发送成功')
        this.$router.replace('/null')
      }
    },
    onLoad () {
      setTimeout(() => {
        this.loading = true
        this.page++
        this.getDynamic(true)
      }, 1000)
    },
    isShow (arr, _id) {
      this.menuId = _id
      this.show = true
      this.cUserList = []
      arr.cid.forEach((item, index) => {
        item = parseInt(item)
        this.commentUser(item, arr.ctimer[index], arr.c[index])
      })
    },
    commentSend () {
      if (this.sms !== '') {
        this.sendComment(this.sms)
        this.sms = ''
      }
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
  },
  components: {
    Navbar
  }
}
</script>

<style lang="less" scoped>
.dynamic-container{
  min-height: 100vh;
  margin-bottom: 50px;
  background: #f5f5f5;
  margin-top: 46px;
  .content{
    background: #fff;
    margin-bottom: 10px;
    padding: 15px;
    .user{
      height: 60px;
      color: #666;
      font-size: 14px;
      img{
        float: left;
        width: 50px;
        border-radius: 50%;
      }
      .nickname{
        display: inline-block;
        transform: translate(10px,4px);
      }
      .publish{
        display: inline-block;
        transform: translate(10px,16px);
      }
    }
    .nei{
      font-size: 14px;
      padding-left: 60px;
      padding-right: 15px;
      margin-bottom: 10px;
      img{
        margin-top: 10px;
        width: 100%;
      }
    }
    .like{
      margin-left: 60px;
      margin-right: 10px;
      float: left;
    }
    .pubComment{
      position: fixed;
      bottom: 0;
    }
    /deep/.van-action-sheet__content{
      margin-bottom: 48px;
    }
  }
  .ty {
      padding: 16px;
      font-size: 12px;
      text-align: left;
      .comment{
      .title{
        font-size: 16px;
        text-align: left!important;
        img{
          width: 50px;
          border-radius: 50%;
        }
        span{
          display: inline-block;
          transform: translate(10px,-17px);
        }
      }
      .matter{
        font-size: 14px;
        padding: 8px 20px;
      }
      .time{
        margin-top: 5px;
        text-align: right;
      }
      }
    }
}
</style>
