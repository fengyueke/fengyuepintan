<template>
  <div class="comment-container">
    <van-action-sheet v-model="show" title="评论">
              <div class="content">
                <div class="comment" v-for="(item,index) in list" :key="index">
                  <div class="title">
                    <img :src="item.headerPh">
                    <span>{{ item.nickname }}</span>
                  </div>
                  <div class="matter">
                    <span>{{ item.cmt }}</span>
                  </div>
                  <div class="time">-{{ item.cmtTime }}</div>
                </div>
              </div>
            </van-action-sheet>
  </div>
</template>

<script>
export default {
  props: ['isShow', 'list'],
  data () {
    return {
      show: this.show
    }
  }
}
</script>

<style lang="less" scoped>
.comment-container{
  footer{
      height: 20px;
      text-align: center;
      font-size: 12px;
    }
    /deep/.content {
      padding: 16px 16px 160px;
      font-size: 12px;
      text-align: left;
      .comment{
      .title{
        text-align: left!important;
        img{
          width: 36px;
          border-radius: 50%;
        }
        span{
          display: inline-block;
          transform: translate(10px,-10px);
        }
      }
      .matter{
        padding: 0 20px;
      }
      .time{
        margin-top: 5px;
        text-align: right;
      }
      }
    }
}
</style>
