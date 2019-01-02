import Vue from 'vue'
import Router from 'vue-router'

// views
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import Posts from '@/views/PostList.vue' 
import PostRead from '@/views/PostRead.vue'
import PostEdit from '@/views/PostEdit.vue'
import MySpace from '@/views/MySpace.vue'
import UserPage from '@/views/UserPage.vue'

// components
import PostLister from '@/components/post-list/PostLister.vue'

//temp
import UserInfo from '@/components/user-information/UserInfo.vue'
import ModifyUser from '@/components/ModifyUser.vue'

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
      path: '/post/read/:pid',
      name: 'read-post',
      component: PostRead,
    },
    {
      path: '/post/add',
      name: 'add-post',
      component: PostEdit,
    },
    {
      path: '/post/add/:bid',
      name: 'add-post-to-board',
      component: PostEdit,
    },
    {
      path: '/post/reply/:rpid',
      name: 'reply-post',
      component: PostEdit,
    },
    {
      path: '/post/edit/:epid',
      name: 'edit-post',
      component: PostEdit,
    },
    {
      path: '/admin-panel',
      name: 'admin-panel',
      component: AdminPanel
    },
    {
      path: '/my-space',
      name: 'my-space',
      component: MySpace,
    },
    {
      path: '/user/:uid',
      name: 'user-page',
      component: UserPage,
    },
    //temp
    {
      path: '/userinfo',
      name: 'user-info',
      component: UserInfo
    },
    {
      path: '/modifyUser',
      name: 'user-modify',
      component: ModifyUser
    }
  ]
})
