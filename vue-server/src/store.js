import Vue from 'vue'
import Vuex from 'vuex'
import userApi from './services/user'
import $ from 'jquery';
require('jquery.cookie');

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    uid: (state) => {
      return state.user ? state.user.uid : null;
    }
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.user = userInfo;
    }
  },
  actions: {
    setUid: async (context, uid) => {
      // use uid to communicate to background to get user info here
      var info = await userApi.getInfo(uid);
      if(info.data && info.data.success) {
        context.commit('setUserInfo', info.data.data);
      }
    },
    setUserCookies: (context, cookies) => {
      $.cookie('user', cookies);
    },
    removeUserCookies: () => {
      $.removeCookie('user');
    }
  }
})
