import Vue from 'vue';
import Vuex from 'vuex';
import Import from '_js/import';

const ModuleFiles = require.context('./modules', true, /(?<!index)\.js$/),
    modules = Import(ModuleFiles, false);

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 导航标签
        tabs: [],
        // 提示消息
        alertMessage: [],
    },
    getters: {
        alertMessage: state => state.alertMessage,
        tabs: state => state.tabs,
    },
    mutations: {
        alertMessagePush(state, data) {
            state.alertMessage.push(data);
        },
        alertMessageDel(state, index) {
            state.alertMessage.splice(index, 1);
        },
    },
    actions: {
        alertMessage({ getters, commit }, data) {
            if (typeof data === 'string') data = { content: data };
            let msg = {
                    top: true,
                    color: 'info',
                    timeout: 6000,
                    content: '',
                    ...data,
                },
                length = getters.alertMessage.length;
            commit('alertMessagePush', msg);
            if (msg.timeout !== 0) {
                setTimeout(() => {
                    commit('alertMessageDel', length - 1);
                }, msg.timeout);
            }
        },
    },
    modules,
});
