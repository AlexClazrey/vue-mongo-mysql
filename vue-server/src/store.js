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
    user: null,
    boards: [],
    groups: [],
    privileges: [],
    userToGroup: [],
    groupToPrivileges: [],
  },
  getters: {
    uid: (state) => {
      return state.user ? state.user.uid : null;
    },
    user: state => state.user,
    boards: state => state.boards,
    groups: state => state.groups,
    privileges: state => state.privileges,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.user = userInfo;
    },
    setBoards(state, payload) {
      state.boards = payload;
    },
    setGroups(state, groups) {
      state.groups = groups;
    },
    setPrivileges(state,privileges) {
      state.privileges = privileges;
    },
    setUserToGroup(state, data) {
      state.userToGroup = data;
    },
    setGroupToPrivileges(state, data) {
      state.groupToPrivileges = data;
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
      $.removeCookie('uid');
      $.removeCookie('user');
    },
    setBoards: async (context)=>{
      var BOARD = await boardApi.getBoards();
      if(BOARD.data && BOARD.data.success){
        context.commit('setBoards', BOARD.data.data)
      }
    },
    refreshGroups: async(context) => {
      await simpleApiCall(context, 'setGroups', '获取用户组列表出错。', groupApi.listGroup);
    },
    refreshPrivileges: async(context) => {
      await simpleApiCall(context, 'setPrivileges', '获取权限列表出错。', groupApi.listPrivileges);
    },
    refreshUserToGroup: async(context) => {
      await simpleApiCall(context, 'setUserToGroup', '获取用户-用户组映射出错。', groupApi.listUserToGroup);
    },
    refreshGroupToPrivileges: async(context) => {
      await simpleApiCall(context, 'setGroupToPrivileges', '获取用户组-权限映射出错。', groupApi.listGroupToPrivileges);
    },
    refreshAdminPanel: (context) => {
      context.dispatch('refreshGroups');
      context.dispatch('setBoards');
      context.dispatch('refreshPrivileges');
      context.dispatch('refreshUserToGroup');
      context.dispatch('refreshGroupToPrivileges');
      // TODO and more...
    },
  }
})
