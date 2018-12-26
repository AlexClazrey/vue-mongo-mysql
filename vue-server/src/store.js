import Vue from 'vue'
import Vuex from 'vuex'
import $ from 'jquery';
require('jquery.cookie');

import router from './router';
import userApi from './services/user'
import boardApi from './services/boards'
import groupApi from './services/group';

Vue.use(Vuex)

async function simpleApiCall(context, mutationName, errMsg, apiAsyncFunction, ...apiArgs) {
  var data = await apiAsyncFunction(...apiArgs);
  if(data.data) {
    if(data.data.success) {
      context.commit(mutationName, data.data.data);
    } else {
      if(data.data.badAuth) {
        router.push({name: 'login'});
        context.dispatch('removeUserCookies');
      } else if (data.data.badPrivilege) {
        alert('你没有这个操作的权限');
      } else if(errMsg) {
        alert(errMsg);
      }
    }
  } else {
    alert(errMsg);
  }
}

export default new Vuex.Store({
  state: {
    navList: [
      { name: 'Home', to: '/' },
      { name: 'Boards', to: '/boards' },
      { name: 'Login', to: '/login' },
    ],
    user: null,
    boards: [],
    adminPanel: {
      requests: 5,
      loaded: 0,
      groups: [],
      privileges: [],
      userToGroup: [],
      groupToPrivileges: [],
      users: [],
    },
  },
  getters: {
    navList: state => state.navList,
    uid: state => state.user ? state.user.id : null,
    user: state => state.user,
    boards: state => state.boards,
    adminPanel: state => state.adminPanel,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.user = userInfo;
    },
    setBoards(state, payload) {
      state.boards = payload;
    },
    setGroups(state, groups) {
      state.adminPanel.groups = groups.sort((a,b) => (a.id - b.id));
    },
    setUsers(state, users) {
      state.adminPanel.users = users;
    },
    setPrivileges(state,privileges) {
      state.adminPanel.privileges = privileges.sort((a,b) => (a.id - b.id));
    },
    setUserToGroup(state, data) {
      state.adminPanel.userToGroup = data.sort((a,b) => (a.id - b.id));
    },
    setGroupToPrivileges(state, data) {
      state.adminPanel.groupToPrivileges = data.sort((a,b) => (a.gid - b.gid));
    },
  },
  actions: {
    setUid: async (context, uid) => {
      // use uid to communicate to background to get user info here
      $.cookie('uid', uid);
      await simpleApiCall(context, 'setUserInfo', '获取用户信息出错。', userApi.getInfo, uid);
    },
    setUserCookies: (context, cookies) => {
      $.cookie('user', cookies);
    },
    removeUserCookies: () => {
      $.removeCookie('uid', { expires: 7 }); // TODO 记住我这个选项到底应该持续多少天还需要说明，我这里先给了七天，实际上在SQL这边也需要更多的接口。
      $.removeCookie('user', { expires: 7 }); // TODO 在注册方面还有检查是否被占用的功能还没有实现。
    },
    refreshBoards: async (context)=>{
      await simpleApiCall(context, 'setBoards', '获取板块列表出错。', boardApi.getBoards);
    },
    refreshUsers: async(context) => {
      await simpleApiCall(context, 'setUsers', '获取用户列表出错。', groupApi.listUser);
      context.state.adminPanel.loaded++;
    },
    refreshGroups: async(context) => {
      await simpleApiCall(context, 'setGroups', '获取用户组列表出错。', groupApi.listGroup);
      context.state.adminPanel.loaded++;
    },
    refreshPrivileges: async(context) => {
      await simpleApiCall(context, 'setPrivileges', '获取权限列表出错。', groupApi.listPrivileges);
      context.state.adminPanel.loaded++;
    },
    refreshUserToGroup: async(context) => {
      await simpleApiCall(context, 'setUserToGroup', '获取用户-用户组映射出错。', groupApi.listUserToGroup);
      context.state.adminPanel.loaded++;
    },
    refreshGroupToPrivileges: async(context) => {
      await simpleApiCall(context, 'setGroupToPrivileges', '获取用户组-权限映射出错。', groupApi.listGroupToPrivileges);
      context.state.adminPanel.loaded++;
    },
    refreshAdminPanel: (context) => {
      context.dispatch('refreshBoards');
      context.state.adminPanel.loaded = 0;
      context.dispatch('refreshUsers');
      context.dispatch('refreshGroups');
      context.dispatch('refreshPrivileges');
      context.dispatch('refreshUserToGroup');
      context.dispatch('refreshGroupToPrivileges');
    },
  }
})
