/*
 * @Author: huhaibiao huhaibiao@do-global.com
 * @Date: 2023-04-21 22:25:35
 */
import * as VueRouter from 'vue-router'

//路由
// 1. 定义路由组件.

const BlockPage = () => import('./../views/BlockPage.vue')
const OtherPage = () => import('./../views/OtherPage.vue')

// 2. 定义一些路由
const routes = [
  { path: '/', component: BlockPage },
  { path: '/index.html', component: BlockPage },
  // { path: '*', component: BlockPage },
  { path: '/other', component: OtherPage }
]

// 3. 创建路由实例并传递 `routes` 配置
export const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHistory(),
  routes // `routes: routes` 的缩写
})
