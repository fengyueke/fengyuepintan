<template>
  <div class="detail-container">
    <van-nav-bar :title="title">
      <template #left>
        <van-icon name="arrow-left" size="22" @click="$router.back()" />
      </template>
      <template #right>
        <van-icon name="share-o" size="22" @click="showShare = true"/>
        <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />
      </template>

    </van-nav-bar>
    <van-tabs v-model="active">
     <van-tab title="菜谱" to="/details/menu"><router-view v-if="active===0"></router-view></van-tab>
     <van-tab title="营养功效" to="/details/nutrition"><router-view v-if="active===1"></router-view></van-tab>
     <van-tab title="饮食禁忌" to="/details/taboo"><router-view v-if="active===2"></router-view></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      id: -1,
      active: 0,
      title: this.$store.state.detailTitle,
      showShare: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    }
  },
  methods: {
    onSelect (option) {
      Toast(option.name)
      this.showShare = false
    }
  },
  created () {
    this.id = this.$store.detailId
  }
}
</script>

<style lang="less" scoped>
.detail-container{
  margin-top: 46px;
  /deep/.van-nav-bar{
    position: fixed;
    width: 100%;
    top: 0;
  }
  /deep/ .van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-tabs__line{
    background-color: #ffdd00;
  }
}
</style>
