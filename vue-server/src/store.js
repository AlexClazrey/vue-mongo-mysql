import Vue from 'vue'
import Vuex from 'vuex'

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

  },
  actions: {
    setUid: (context, uid) => {
      // use uid to communicate to background to get user info here
    }
  }
})
