import { api } from '@/api';
import Router from '@/router';
let state = {
    token: localStorage.getItem('token') || '',
    userInfo: localStorage.getItem('userInfo') || null,
};
const getters = {
        token: state => state.token,
        userInfo: state => state.userInfo,
    },
    mutations = {
        setToken(state, data) {
            state.token = data;
            localStorage.setItem('token', data);
        },
        setUserInfo(state, data) {
            state.userInfo = data;
            localStorage.setItem('userInfo', data);
        },
        // 退出登陆
        signOut(state) {
            state.token = '';
            state.userInfo = null;
            localStorage.setItem('token', '');
            localStorage.setItem('userInfo', null);
            location.reload();
        },
    },
    actions = {
        // 用户登陆
        signIn({ commit }, data) {
            return api.user.signIn(data).then(res => {
                commit('setToken', res.token);
                commit('setUserInfo', res.sysUser);
                Router.push({ path: '/' });
            });
        },
        // 修改用户密码
        updateUserPassword({ commit }, data) {
            return api.user.updateUserPassword(data).then();
        },
        // 发送验证码
        emitPhoneCode(context, data) {
            return api.user.emitPhoneCode(data);
        },
    };
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
