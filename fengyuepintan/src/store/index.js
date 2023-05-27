import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 控制引导页的自动跳转
    swiper: 3,
    // 控制分页类的展现
    homePage: true,
    // 详情页的标题
    detailTitle: '',
    // 给详情页的id
    detailId: '',
    // 搜索的内容
    searchVal: '',
    // 搜索的分类
    searchActive: 0,
    // 点击搜索历史中的内容，拿到的值
    searchOld: '',
    // 集市根据价格是否降序排序
    isDesc: false,
    // 集市中的nav模块中米面粮油，控制是否根据价格排序
    riceIsDesc: false
  },
  getters: {
  },
  mutations: {
    // 轮播引导页
    swiperTime (state) {
      setInterval(function () {
        if (state.swiper > 0) {
          state.swiper--
        }
      }, 1000)
    },
    // 点击跳过，结束时间，进入主页
    swiperZero (state) {
      state.swiper = 0
    },
    // 切换主页的展示
    toggleHome (state) {
      state.homePage = !state.homePage
    },
    // 给详情页的标题赋值
    addDetailTitle (state, title) {
      state.detailTitle = title
    },
    // 给详情页的id赋值
    addDetailId (state, id) {
      state.detailId = id
    },
    addSearchVal (state, val) {
      state.searchVal = val
    },
    updataSearchActive (state, val) {
      state.searchActive = val
    },
    updataSearchOld (state, val) {
      state.searchOld = val
    },
    updateIsDesc (state) {
      state.isDesc = !state.isDesc
    },
    updateRiceIsDesc (state) {
      state.riceIsDesc = !state.riceIsDesc
    }

  },
  actions: {
  },
  modules: {
  }
})
