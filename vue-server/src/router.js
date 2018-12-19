import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Posts from '@/components/PostsList.vue' 
import AddPost from '@/components/AddPost.vue'
import EditPost from '@/components/EditPost.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Boards from '@/components/Boards.vue'
import AdminPanel from '@/components/AdminPanel.vue'

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
      path: '/boards',
      name: 'boards',
      component: Boards
    },
    {
      path: '/boards/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/posts/edit/:id',
      name: 'editPost',
      component: EditPost
    },
    {
      path: '/posts/new',
      name: 'newPost',
      component: AddPost
    },
    {
      path: '/admin-panel',
      name: 'admin panel',
      component: AdminPanel
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
