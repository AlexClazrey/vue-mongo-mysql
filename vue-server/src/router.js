import Vue from 'vue'
import Router from 'vue-router'

// views
// import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import Posts from '@/views/PostList.vue' 
import PostRead from '@/views/PostRead.vue'
import PostEdit from '@/views/PostEdit.vue'
import PostSearch from '@/views/PostSearch.vue'
import MySpace from '@/views/MySpace.vue'
import UserPage from '@/views/UserPage.vue'

// components
import PostLister from '@/components/post-list/PostLister.vue'
import MySpacePosts from '@/components/user-space/Posts.vue'
import MySpaceDrafts from '@/components/user-space/Drafts.vue'
import MySpaceFavorites from '@/components/user-space/Favorites.vue'
import MySpaceSettings from '@/components/user-space/Settings.vue'

//temp
import UserInfo from '@/components/user-information/UserInfo.vue'
import ModifyUser from '@/components/user-space/ChangePass.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/posts'
      // name: 'home',
      // component: Home,
      // meta: {
      //   title: 'BeForum Home'
      // }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login - Beforum'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: 'Register - Beforum'
      }
    },
    {
      path: '/posts',
      component: Posts,
      meta: { title: 'Posts - Beforum' },
      children: [
        { path: '', name: 'all-posts', component: PostLister },
        { path: ':bid', name: 'board-posts', component: PostLister },
      ],
    },
    {
      path: '/post/read/:pid',
      name: 'read-post',
      component: PostRead,
      meta: { title: 'Post - Beforum' },
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
      path: '/post/search/:keyword',
      name: 'post-search',
      component: PostSearch
    },
    {
      path: '/my-space',
      redirect: '/my-space/posts',
      name: 'my-space',
      component: MySpace,
      children: [
        { path: 'posts', name: 'my-space-posts', component: MySpacePosts },
        { path: 'drafts', name: 'my-space-drafts', component: MySpaceDrafts },
        { path: 'favorites', name: 'my-space-favorites', component: MySpaceFavorites },
        { path: 'settings', name: 'my-space-settings', component: MySpaceSettings },
      ],
    },
    {
      path: '/user/:uid',
      name: 'user-page',
      component: UserPage,
    },
    //temp
    {
      path: '/user-info',
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

router.beforeEach((to, from, next) => {
  if(to.meta && to.meta.title) {
    // console.log(to);
    document.title = to.meta.title;
  }
  next();
})

export default router;