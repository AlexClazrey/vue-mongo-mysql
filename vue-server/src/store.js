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
      if(mutationName)
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

const initState = {
  nav: {
    list: [
      { name: 'Home', to: '/' },
      { name: 'Posts', to: '/posts' },
      { name: 'Login', to: '/login', visible: (context) => !context.getters.uid },
      { name: 'Admin Panel', to: '/admin-panel', visible: (context) => context.getters.privilegeNames.includes('user admin') },
      { name: 'Logout', click: (context) => { context.dispatch('userLogout'); }, visible: (context) => context.getters.uid },
    ],
  },
  user: {
    info: null,
    privileges: [],
  },
  files: {
    mapping: {},
  },
  posts: {
    postsCountOnOnePage: 20,
  },
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
};

function deepCopy(source) {
  return $.extend(true, {}, source);
}

export default new Vuex.Store({
  strict: true,
  state: deepCopy(initState), // state is a deep copy of initState
  getters: {
    navList: state => state.nav.list,
    uid: state => state.user.info ? state.user.info.id : null,
    user: state => state.user.info,
    privileges: state => state.user.privileges,
    privilegeNames: state => state.user.privileges.map(pri => pri.priName),
    boards: state => state.boards,
    adminPanel: state => state.adminPanel,
    fileMap: state => state.files.mapping,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.user.info = userInfo;
    },
    setUserPrivileges(state, userPri) {
      state.user.privileges = userPri;
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
    addAdminPanelReplyCounter(state) {
      state.adminPanel.loaded++;
    },
    resetAdminPanelReplyCounter(state) {
      state.adminPanel.loaded = 0;
    },
    resetUser(state) {
      state.user = deepCopy(initState.user); // copy initState into current state
    },
    resetAdminPanel(state) {
      state.adminPanel = deepCopy(initState.adminPanel);
    }
  },
  actions: {
    // 命名规则： refresh用来刷新元素列表，fetch用来获取一个确定的信息
    pageLoad: (context) => {
      context.dispatch('refreshBoards');
      context.dispatch('fetchUser');
    },
    userLogin: (context, data) => {
      context.dispatch('setUid', data.uid);
      context.dispatch('setUserCookies', data.cookies);
      context.dispatch('fetchUser');
    },
    userLogout: async (context) => {
      await simpleApiCall(context, null, '请求注销出错', userApi.userLogout);
      context.dispatch('resetPrivilegedInfo');
      context.dispatch('removeUserCookies');
      router.push({name: 'login'})
    },
    resetPrivilegedInfo(context) {
      context.commit('resetUser');
      context.commit('resetAdminPanel');
    },
    setUid: (context, uid) => {
      // use uid to communicate to background to get user info here
      if(uid) {
        $.cookie('uid', uid);
      } else {
        alert('uid not valid');
      }
    },
    setUserCookies: (context, cookies) => {
      $.cookie('user', cookies);
    },
    removeUserCookies: () => {
      $.removeCookie('uid', { expires: 7 }); // TODO 记住我这个选项到底应该持续多少天还需要说明，我这里先给了七天，实际上在SQL这边也需要更多的接口。
      $.removeCookie('user', { expires: 7 }); // TODO 在注册方面还有检查是否被占用的功能还没有实现。
    },
    fetchUser: (context) => {
      const uid = $.cookie('uid');
      if(uid) {
        context.dispatch('fetchUserInfo', uid);
        context.dispatch('fetchUserPrivileges', uid);
      }
    },
    fetchUserInfo: (context, uid) => {
      simpleApiCall(context, 'setUserInfo', '获取用户信息出错。', userApi.getInfo, uid);
    },
    fetchUserPrivileges: (context, uid) => {
      simpleApiCall(context, 'setUserPrivileges', '获取用户权限信息出错。', userApi.getPrivileges, uid);
    },
    fetchFileAddress: (context, fileId) => {
      // TODO 
    },
    refreshBoards: (context) => {
      simpleApiCall(context, 'setBoards', '获取板块列表出错。', boardApi.getBoards);
    },
    refreshAdminPanel: (context) => {
      context.dispatch('refreshBoards');
      context.commit('resetAdminPanelReplyCounter');
      context.dispatch('refreshUsers');
      context.dispatch('refreshGroups');
      context.dispatch('refreshPrivileges');
      context.dispatch('refreshUserToGroup');
      context.dispatch('refreshGroupToPrivileges');
    },
    refreshUsers: async(context) => {
      await simpleApiCall(context, 'setUsers', '获取用户列表出错。', groupApi.listUser);
      context.commit('addAdminPanelReplyCounter');
    },
    refreshGroups: async(context) => {
      await simpleApiCall(context, 'setGroups', '获取用户组列表出错。', groupApi.listGroup);
      context.commit('addAdminPanelReplyCounter');
    },
    refreshPrivileges: async(context) => {
      await simpleApiCall(context, 'setPrivileges', '获取权限列表出错。', groupApi.listPrivileges);
      context.commit('addAdminPanelReplyCounter');
    },
    refreshUserToGroup: async(context) => {
      await simpleApiCall(context, 'setUserToGroup', '获取用户-用户组映射出错。', groupApi.listUserToGroup);
      context.commit('addAdminPanelReplyCounter');
    },
    refreshGroupToPrivileges: async(context) => {
      await simpleApiCall(context, 'setGroupToPrivileges', '获取用户组-权限映射出错。', groupApi.listGroupToPrivileges);
      context.commit('addAdminPanelReplyCounter');
    },
  }
})
