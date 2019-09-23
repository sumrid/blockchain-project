import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    user: ''
}

const actions = {
    setUser: ({commit}, user) => {
        commit('SET_USER', user);
    }
}

/**
 * mutations ทำหน้าที่เปลี่ยนแปลงข้อมูล
 */
const mutations = {
    SET_USER (state, user) {
        state.user = user;
    }
}

const getters = {
    getUser: (state) => {
        return state.user;
    }
}



export default new Vuex.Store({
    state: state,
    actions: actions,
    mutations: mutations,
    getters: getters
})