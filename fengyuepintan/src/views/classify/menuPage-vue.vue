<template>
  <div class="menu-container">
    <img class="banner" :src="menuArr.url">
    <div class="introduce">
      <div class="title">{{ $store.state.detailTitle }}</div>
      <span>{{ menuArr.browse }}浏览</span><span>·{{ menuArr.collect }}收藏</span><span>·{{ menuArr.learn }}学做</span>
      <br>
      <van-tag class="tag" type="warning" color="#FF6E00" text-color="#fff">独家</van-tag>
      <div class="reason">
        {{ menuArr.introduce }}
      </div>
    </div>
      <div class="userInfo">
        <div class="headerInfo">
          <img :src="userInfo.headerPh" alt="">
          <span>{{ userInfo.nickname }}</span>
          <van-button class="btn" icon="plus" v-if="!ct" type="primary" @click="focusT">关注</van-button>
          <van-button class="btn"  type="primary" v-else @click="focusT">取消关注</van-button>
        </div>
        <div class="brief">
          <van-icon name="clock" size="18" /><span class="sn ri">&nbsp;&nbsp;时间: <span>{{ menuArr.timeconsuming }}</span></span>
          <van-icon name="smile" size="18" /><span class="sn">&nbsp;&nbsp;难度: <span>{{ menuArr.difficulty }}</span></span><br>
          <van-icon name="like" size="18"/><span class="sn">&nbsp;&nbsp;<span>{{ menuArr.liked }}</span></span>
        </div>
      </div>
      <div class="inventory">
        <div class="title">-&nbsp;食材清单&nbsp;-</div>
        <van-cell-group>
        <van-cell v-for="(item,index) in inventory" :key="index" :title="item.food" :value="item.amount" />
        </van-cell-group>
      </div>
      <div class="cuisine">
        <div class="title">-&nbsp;烹饪步骤&nbsp;-</div>
        <dl v-for="(item,index) in step" :key="index">
          <dt><img :src="item.stepUrl"></dt>
          <dd>{{ item.stepText }}</dd>
        </dl>
      </div>
      <div class="tips">
        <div class="title">小贴士</div>
        <div class="cont">
          <p v-for="(item,index) in tips" :key="index">{{ item }}</p>
          <ul>
            <li>
              <van-uploader>
                <span>上传我做的</span>
              </van-uploader>
            </li>
            <li @click="showComment(comment[0])">
              {{ comment[0].cid.length }}条评论
            </li>
            <van-action-sheet v-model="show" title="评论">
              <div class="ty">
                <div class="comment" v-for="item in commentInfo" :key="item.id">
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
                v-model="message"
                center
                clearable
                label="评论"
                placeholder="请输入内容"
                >
                <template #button>
                  <van-button size="mini" round type="info" @click="commentSend">发送</van-button>
                </template>
              </van-field>
            </div>

            </van-action-sheet>
          </ul>
          <footer>-&nbsp;发布于{{menuArr.publishTime}}&nbsp;-</footer>
        </div>
      </div>
      <footer>
        <van-button plain type="primary" @click="show=true"><van-icon name="smile-comment-o"  />&nbsp;评论</van-button>
        <van-button plain type="primary" v-if="!isCollect" @click="addCollect"><van-icon name="star-o" />&nbsp;收藏</van-button>
        <van-button plain type="primary" v-else style="color: #ffdd55;" @click="addCollect"><van-icon name="star-o" />&nbsp;收藏</van-button>
      </footer>
      <ScrollPage></ScrollPage>
  </div>
</template>

<script>
import { Toast } from 'vant'
import dayjs from 'dayjs'
import ScrollPage from '@/components/scrollTop-vue.vue'
import qs from 'qs'

export default {
  data () {
    return {
      show: false,
      message: '',
      isCollect: '',
      id: -1,
      menuArr: [],
      inventory: '',
      userInfo: [],
      step: [],
      tips: [],
      comment: [],
      commentInfo: [],
      userId: [],
      token: '',
      ct: ''
    }
  },
  methods: {
    addCollect (e) {
      if (!this.isCollect) {
        Toast('收藏成功')
      } else {
        Toast('取消收藏')
      }
      this.collectUser()
    },
    onSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
      Toast(item.name)
    },
    showComment (arr) {
      this.show = true
      this.commentInfo = []
      arr.cid.forEach((item, index) => {
        item = parseInt(item)
        this.commentUser(item, arr.ctimer[index], arr.c[index])
      })
    },
    commentSend () {
      if (this.message !== '') {
        this.sendComment(this.message)
        this.sms = ''
      }
    },
    focusT () {
      this.focusUser()
      if (!this.ct) {
        Toast('关注成功')
      } else {
        Toast('取消成功')
      }
    },
    async getMenuPage (id) {
      const { data: res } = await this.$http.get('/api/menu', { headers: { authorization: this.token }, params: { id: id } })
      if (res.status === 200) {
        this.userId = res.data.userId
        this.menuArr = res.data
        this.inventory = res.data.inventory
        this.inventory = this.inventory.split(',')
        const even = this.inventory.filter((item, index) => {
          if (index % 2 === 0) {
            return item
          }
          return false
        })
        const odd = this.inventory.filter((item, index) => {
          if (index % 2 !== 0) {
            return item
          }
          return false
        })
        this.inventory = []
        odd.forEach((item, index) => {
          this.inventory.push({ food: even[index], amount: item })
        })
        let stepText = res.data.step
        stepText = stepText.split('&')
        let stepUrl = res.data.stepurl
        stepUrl = stepUrl.split(',')
        stepUrl.forEach((item, index) => {
          this.step.push({ stepText: stepText[index], stepUrl: item })
        })
        let tipsString = res.data.tips
        tipsString = tipsString.split('&')
        this.tips = tipsString
        const arr = res.data.comment.split('&')
        const cid = res.data.commentId.split('&')
        const cTimer = res.data.commentTime.split('&')
        this.comment.push({ c: arr, cid: cid, ctimer: cTimer })
      } else if (res.msg === 'No authorization token was found') {
        alert('请先登录')
        this.$router.replace('/login')
      } else if (res.msg === 'jwt expired') {
        alert('请先登录')
        this.$router.replace('/login')
      }
    },
    async commentUser (_id, _time, _comment) {
      _time = dayjs(_time).format('YYYY-MM-DD HH:mm')
      const { data: res } = await this.$http.get('/my/userInfo', { params: { uid: _id } })
      if (res.status === 200) {
        this.commentInfo.push({ uid: res.data.uid, nickname: res.data.nickname, hp: res.data.headerPh, time: _time, comment: _comment })
      }
    },
    async getUser () {
      const { data: res } = await this.$http.get('/my/userInfo', { params: { uid: this.$store.state.detailId } })
      if (res.status === 200) {
        this.userInfo = {
          nickname: res.data.nickname,
          headerPh: res.data.headerPh,
          uid: res.data.uid
        }
      }
    },
    async sendComment (info) {
      const data = qs.stringify({ id: this.$store.state.detailId, comment: info })
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
        this.$router.replace('/null/menu')
      }
    },
    async focusUser () {
      const data = qs.stringify({ uid: this.userInfo.uid })
      const { data: res } = await this.$http({
        url: '/api/focus',
        method: 'POST',
        data: data,
        headers: {
          authorization: this.token
        }
      })
      if (res.status === 200) {
        this.ct = !this.ct
      }
      console.log(res)
    },
    async getFocus () {
      const { data: res } = await this.$http.get('/api/getFocus', { headers: { authorization: this.token } })
      if (res.status === 200) {
        if (res.msg === '已关注') {
          this.ct = true
        } else if (res.msg === '未关注') {
          this.ct = false
        }
      }
    },
    async collectUser () {
      const data = qs.stringify({ id: this.$store.state.detailId })
      const { data: res } = await this.$http({
        url: '/api/collect',
        method: 'POST',
        data: data,
        headers: {
          authorization: this.token
        }
      })
      console.log(res)
    },
    async getCollect () {
      const { data: res } = await this.$http.get('/api/getCollect', { headers: { authorization: this.token }, params: { id: this.$store.state.detailId } })
      if (res.status === 200) {
        this.isCollect = res.msg
        console.log(this.isCollect)
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
      this.id = this.$store.state.detailId
      this.getMenuPage(this.id)
      this.getUser()
      this.getFocus()
      this.getCollect()
    }
  },
  components: {
    ScrollPage
  }
}
</script>

<style lang="less" scoped>
.menu-container{
  min-height: 100vh;
  background: #F5F5F5;
  .banner{
    width: 100%;
  }
  .introduce{
    margin-top: 10px;
    text-align: center;
    .title{
      color: #6E6E6E;
      font-size: 25px;
      margin-bottom: 2px;
    }
    span{
      color: #838383;
      display: inline-block;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .reason{
      color: #838383;
      padding: 10px;
      font-size: 12px;
      text-align: left;
    }

  }
  .userInfo{
    .headerInfo{
      text-align: left;
      padding: 10px;
      img{
        width: 40px;
        border-radius: 50%;
      }
      span{
        display: inline-block;
        font-size: 14px;
        transform: translate(15px,-14px);
      }
      .btn{
        height: 40px;
        line-height: 40px;
        float: right;
        background: 0;
        border: 1px solid #FD6E00;
        color: #FD6E00;
        span{
          color: #FD6E00;
          transform: translate(0,2px);
        }
      }
    }
    .brief{
    text-align: left;
    padding: 0 10px;
    .sn{
      transform: translate(0,-4px);
    }
    .ri{
      margin-right: 40px;
    }
    span{
      font-size: 12px;
    }
  }
  }
  .inventory{
    color: #676767;
    .title{
      margin: 15px;
      font-size: 25px;
      text-align: center;
    }
    .van-cell{
      background: #f5f5f5;
      ::before{
        border-bottom: 1px solid #A3A3A3;
      }
    }
    .van-cell__value{
      text-align: center;
    }
  }
  .cuisine{
      margin: 0;
      padding: 0;
    .title{
      font-size: 25px;
      text-align: center;
      color: #676767;
    }
    dl{
      list-style-type: none;
      dt{
        width: 100px;
        padding: 10px;
        img{
          width: 355%;
        }
      }
      dd{
        margin: 0;
        padding: 10px;
      }
    }
  }
  .tips{
    padding: 10px;
    .title{
      text-align: center;
      font-size: 14px;
      color: #676767;
    }
    p{
      margin: 0;
    }
    ul{
      color: #FC6B01;
      margin-left: 15px;
      list-style: disc;
    }
    footer{
      height: 20px;
      text-align: center;
      font-size: 12px;
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
    .pubComment{
      position: fixed;
      bottom: 0;
    }
    /deep/.van-action-sheet__content{
      margin-bottom: 48px;
    }
  }
  footer{
    height: 80px;
    .content{
      height: 200px;
    }
    /deep/.van-button{
      height: 30px;
      position: relative;
      left: 223px;
      :nth-child(1){
      }
    }
    /deep/.van-button--primary{
      border: 0;
      background: #fff;
      :first{
        border-radius: 14px 0 0 14px;
      }
    }
    /deep/.van-button--plain.van-button--primary{
      color: #000;
    }

  }

}
</style>
