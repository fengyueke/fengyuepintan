<template>
  <div class="classify-container">
    <!-- 头部区域 -->
    <van-nav-bar title="全部分类" @click-left="$router.push('/')">
      <template #left>
        <van-icon name="arrow-left" size="26"  />
      </template>
      <template #right>
        <van-icon name="search" size="26" />
      </template>
    </van-nav-bar>
    <!-- 内容 -->
    <van-collapse v-model="activeNames">
      <van-collapse-item :icon="titleIcon[0]" title="时令食材" name="1">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in grocery" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[1]" title="热门" name="2">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in hot" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[2]" title="口味" name="3">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in taste" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[3]" title="蔬菜" name="4">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in vegetable" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[4]" title="肉类" name="5">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in meat" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[5]" title="水产" name="6">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in aquatic" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[6]" title="主食" name="7">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in staple" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[7]" title="菜系" name="8">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in styleCooking" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[8]" title="食疗养生" name="9">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in therapy" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[9]" title="美容瘦身" name="10">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in hairdressing" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[10]" title="蛋奶豆制品" name="11">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in bean" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[11]" title="水果干果" name="12">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in fruits" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item :icon="titleIcon[12]" title="米面杂粮" name="13">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in rice" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
      <van-collapse-item  :icon="titleIcon[13]" title="烹饪方式及工具" name="14">
        <van-grid :gutter="10" column-num="3">
          <van-grid-item v-for="item in cooking" :key="item" :text="item"  />
        </van-grid>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>

export default {
  data () {
    return {
      activeNames: ['1'],
      titleIcon: [],
      content: [],
      grocery: '',
      hot: '',
      taste: '',
      vegetable: '',
      meat: '',
      aquatic: '',
      staple: '',
      styleCooking: '',
      therapy: '',
      hairdressing: '',
      bean: '',
      fruits: '',
      rice: '',
      cooking: '',
      token: ''

    }
  },
  methods: {
    async initIcon () {
      const { data: res } = await this.$http.get('/api/classify', { headers: { authorization: this.token } })
      console.log(res)
      if (res.status === 200) {
        res.data.forEach(item => {
          this.titleIcon.push(item.titleIcon)
          this.content.push(item.content)
          return true
        })
        this.grocery = this.content[0]
        this.grocery = this.grocery.split(',')
        this.hot = this.content[1]
        this.hot = this.hot.split(',')
        this.taste = this.content[2]
        this.taste = this.taste.split(',')
        this.vegetable = this.content[3]
        this.vegetable = this.vegetable.split(',')
        this.meat = this.content[4]
        this.meat = this.meat.split(',')
        this.aquatic = this.content[5]
        this.aquatic = this.aquatic.split(',')
        this.staple = this.content[6]
        this.staple = this.staple.split(',')
        this.styleCooking = this.content[7]
        this.styleCooking = this.styleCooking.split(',')
        this.therapy = this.content[8]
        this.therapy = this.therapy.split(',')
        this.hairdressing = this.content[9]
        this.hairdressing = this.hairdressing.split(',')
        this.bean = this.content[10]
        this.bean = this.bean.split(',')
        this.fruits = this.content[11]
        this.fruits = this.fruits.split(',')
        this.rice = this.content[12]
        this.rice = this.rice.split(',')
        this.cooking = this.content[13]
        this.cooking = this.cooking.split(',')
      } else if (res.msg === 'No authorization token was found') {
        alert('请先登录')
        this.$router.replace('/login')
      } else if (res.msg === 'jwt expired') {
        alert('令牌过期，请重新登录')
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
    } else {
      this.initIcon()
      this.$store.commit('toggleHome')
    }
  }
}
</script>

<style lang="less" scoped>
.classify-container{
  /deep/ .van-nav-bar__content{
    background: #ffdd00;
  }
  /deep/.van-nav-bar .van-icon{
    color: #000;
  }
  /deep/.van-collapse-item__content{
    background-color: #F5F5F5;
  }
  /deep/.van-icon__image{
    width: 2rem;
    height: 2rem;
    transform: translate(0,-5px);
  }
}
</style>
