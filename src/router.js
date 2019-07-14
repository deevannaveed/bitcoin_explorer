import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/block-height/:blockHeight',
      name: 'blockSearch',
      component: () => import('./views/SearchResult.vue')
    },
    {
      path: '/block-hash/:blockHash',
      name: 'blockSearchByHash',
      component: () => import('./views/SearchResultByHash.vue')
    }
  ]
})
