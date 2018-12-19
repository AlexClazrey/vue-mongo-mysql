import Vue from 'vue'
import Vuex from 'vuex'
import userApi from './services/user'
import boardApi from './services/boards'
import $ from 'jquery';
require('jquery.cookie');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    boards:[]
  },
  getters: {
    uid: (state) => {
      return state.user ? state.user.uid : null;
    },
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.user = userInfo;
    },
    setBoards: (state, payload) => {
      state.boards =  payload;
    }
  },
  actions: {
    setUid: async (context, uid) => {
      // use uid to communicate to background to get user info here
      $.cookie('uid', uid);
      var info = await userApi.getInfo(uid);
      if(info.data && info.data.success) {
        context.commit('setUserInfo', info.data.data);
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
    }
  }
})
