import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
const Routes = setupLayouts(routes)
const router = createRouter({
  // #/router  hash模式
  // /router  history模式  pushState, popState ,replace方法
  //SEO  抓取HTML JS Vue SSR Nuxt
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Routes,
})
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ path: '/home' })
  } else {
    next()
  }
})

export default router
