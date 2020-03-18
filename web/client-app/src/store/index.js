import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    user: '',
    userInfo: ''
}

const actions = {
    setUser: ({commit}, user) => {
        commit('SET_USER', user);
    },
    setUserInfo: ({commit}, userInfo) => {
        commit('SET_USER_INFO', userInfo);
    }
}

/**
 * mutations ทำหน้าที่เปลี่ยนแปลงข้อมูล
 */
const mutations = {
    SET_USER (state, user) {
        state.user = user;
    },
    SET_USER_INFO (state, userInfo) {
        state.userInfo = userInfo
    }
}

const getters = {
    getUser: (state) => {
        return state.user;
    },
    getUserInfo: (state) => {
        return state.userInfo;
    }
}



export default new Vuex.Store({
    state: state,
    actions: actions,
    mutations: mutations,
    getters: getters
})