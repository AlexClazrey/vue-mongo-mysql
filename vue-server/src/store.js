import Vue from 'vue'
import Vuex from 'vuex'
import userApi from './services/user'
import boardApi from './services/boards'
import $ from 'jquery';
import groupApi from './services/group';
require('jquery.cookie');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    boards:[],
    groups: [],
    privileges: [],
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
    }
  },
  actions: {
    setUid: async (context, uid) => {
      // use uid to communicate to background to get user info here
      $.cookie('uid', uid);
      var info = await userApi.getInfo(uid);
      if(info.data && info.data.success) {
        context.commit('setUserInfo', info.data.data);
      } else {
        alert('获取用户信息出错。');
      }
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
      var groups = await groupApi.listGroup();
      if(groups.data && groups.data.success)
        context.commit('setGroups', groups.data.data);
      else
        alert('获取用户组列表出错。');
    },
    refreshAdminPanel: (context) => {
      context.dispatch('refreshGroups');
      context.dispatch('setBoards');
      // TODO and more...
    }
  }
})
