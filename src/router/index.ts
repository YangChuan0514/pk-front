import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const router = createRouter({
  // #/router  hash模式
  // /router  history模式  pushState, popState ,replace方法
  //SEO  抓取HTML JS Vue SSR Nuxt
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
