import Vue from 'vue'
import Router from 'vue-router'

// views
import Home from '@/views/Home.vue'
import Posts from '@/views/PostList.vue' 
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AdminPanel from '@/views/AdminPanel.vue'

// components
import PostLister from '@/components/post-list/PostLister.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/posts',
      component: Posts,
      children: [
        { path: '', name: 'all-posts', component: PostLister },
        { path: ':bid', name: 'board-posts', component: PostLister },
      ]
    },
    {
      path: '/admin-panel',
      name: 'admin panel',
      component: AdminPanel
    },
  ]
})
