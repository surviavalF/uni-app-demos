

import store from '@/store'
import _ from 'lodash'

const authModule = {
  namespaced: true,
  state: {
    token: uni.getStorageSync('token') || null,
  },
  getters: {
    isAuth: state => {
      return !!state.token && !_.isEmpty(state.userData)
    },
  },
  mutations: {
    setToken(state, val) {
      state.token = val
      uni.setStorageSync('token', val)
    },
    clear(state) {
      state.token = null
      uni.removeStorageSync('token')

    }
  },
  actions: {
    async signIn({ dispatch, commit }, options) {
      try {
        commit('setToken', '少林驻武当山办事处王喇嘛的token')
      } catch (error) {
        console.log(error)
      }
    },
  }
}

export default authModule
