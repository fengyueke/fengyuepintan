import Vue from 'vue'
import VueRouter from 'vue-router'
import ClassIfy from '@/views/classify/classIfy-vue.vue'
import HomePage from '@/views/homePage/homePage-vue.vue'
import detailPage from '@/views/classify/detailPage-vue.vue'
import menuPage from '@/views/classify/menuPage-vue.vue'
import nutritionPage from '@/views/classify/nutritionPage-vue.vue'
import tabooPage from '@/views/classify/tabooPage-vue.vue'
import searchPage from '@/views/search/search-vue.vue'
import searchMenuPage from '@/views/search/searchMenu-vue.vue'
import dimSearchMenuPage from '@/views/search/dimSearchMenu-vue.vue'
import searchUserPage from '@/views/search/searchUser-vue.vue'
import dimSearchUser from '@/views/search/dimSearchUser-vue.vue'
import searchCommodity from '@/views/search/searchCommodity-vue.vue'
import newsPage from '@/views/news/news-vue.vue'
import userInfo from '@/views/user/userInfo-vue.vue'
import loginPage from '@/views/user/login-vue.vue'
import registerPage from '@/views/user/register-vue.vue'
import forgetPage from '@/views/user/forget-vue.vue'
import setting from '@/views/user/setting-vue.vue'
import setUserPage from '@/views/user/setUser-vue.vue'
import setPhonePage from '@/views/user/settingC/setPhone-vue.vue'
import setPwdPage from '@/views/user/settingC/setPwd-vue.vue'
import setBasicPage from '@/views/user/settingC/setBasic-vue.vue'
import setNewsPage from '@/views/user/settingC/setNews-vue.vue'
import MyMenu from '@/views/user/myMenu/myMenu-vue.vue'
import Market from '@/views/market/market-vue.vue'
import MarketNavPage from '@/views/market/marketNav-vue.vue'
import MarketDetailsPage from '@/views/market/marketDetails-vue.vue'
import MarketShopPage from '@/views/market/marketShop-vue.vue'
import Dynamic from '@/views/dynamic/dynamic-vue.vue'
import nullPage from '@/views/dynamic/null-vue.vue'
import MyCollectPage from '@/views/user/myCollect/myCollect-vue.vue'
import CartPage from '@/views/shopping/cart-vue.vue'
import IndentPage from '@/views/shopping/indent-vue.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向
  { path: '/', component: HomePage },
  { path: '/classify', component: ClassIfy },
  {
    path: '/details',
    component: detailPage,
    children: [
      { path: '', redirect: 'menu' },
      { path: 'menu', component: menuPage },
      { path: 'nutrition', component: nutritionPage },
      { path: 'taboo', component: tabooPage }
    ]
  },
  {
    path: '/search',
    component: searchPage,
    children: [
      { path: '', redirect: 'searchMenu' },
      { path: 'searchMenu', component: searchMenuPage },
      { path: 'dimSearchMenu', component: dimSearchMenuPage },
      { path: 'searchUser', component: searchUserPage },
      { path: 'dimSearchUser', component: dimSearchUser },
      { path: 'searchCommodity', component: searchCommodity }
    ]
  },
  { path: '/news', component: newsPage },
  { path: '/user', component: userInfo },
  { path: '/login', component: loginPage },
  { path: '/register', component: registerPage },
  { path: '/forget', component: forgetPage },
  { path: '/setting', component: setting },
  { path: '/setuser', component: setUserPage },
  { path: '/setphone', component: setPhonePage },
  { path: '/setpwd', component: setPwdPage },
  { path: '/sethp', component: setBasicPage },
  { path: '/setnews', component: setNewsPage },
  { path: '/myMenu', component: MyMenu },
  { path: '/myCollect', component: MyCollectPage },
  { path: '/market', component: Market },
  { path: '/marketNav/:title', component: MarketNavPage },
  { path: '/marketDetails/:id', component: MarketDetailsPage },
  { path: '/marketShop/:id', component: MarketShopPage },
  { path: '/dynamic', component: Dynamic },
  { path: '/null/:path', component: nullPage },
  { path: '/cart', component: CartPage },
  { path: '/indent', component: IndentPage }
]

const router = new VueRouter({
  routes
})

export default router
