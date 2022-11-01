

import store from '@/store'
import _ from 'lodash'

const authModule = {
  namespaced: true,
  state: {
    token: uni.getStorageSync('token') || null,
    userIcon: uni.getStorageSync('userIcon') || null,
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
    setUserIcon(state, val) {
      state.userIcon = val
      uni.setStorageSync('userIcon', val)
    },
    clear(state) {
      state.token = null
      state.userIcon = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('userIcon')

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
