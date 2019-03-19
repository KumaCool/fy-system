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
        updateUserPassword(context, data) {
            return api.user.updateUserPassword(data).then();
        },
        // 发送验证码
        emitPhoneCode(context, data) {
            return api.user.emitPhoneCode(data);
        },
        // 获取用户列表
        getUserList(context, data) {
            return api.user.getUserList(data);
        },
        // 添加用户
        addUser(context, data) {
            return api.user.addUser(data);
        },
        // 编辑用户
        updateUser(context, data) {
            // 剥离用户状态操作
            let post = R.omit(['handleState'], data);
            return api.user.updateUser(post);
        },
        // 重置用户密码
        resetPassword(context, userId) {
            return api.user.updateUser({
                userId,
                handleState: 3,
            });
        },
        // 切换用户的单独购票状态
        changeBuyState(context, userId) {
            return api.user.updateUser({
                userId,
                handleState: 4,
            });
        },
        // 注销用户
        delUser(context, userId) {
            return api.user.updateUser({
                userId,
                handleState: 0,
            });
        },
    };
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
