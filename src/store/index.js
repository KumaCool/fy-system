import Vue from 'vue';
import Vuex from 'vuex';
import Import from '_js/import';
import Router from '@/router';
import menus from './menu';

Vue.use(Vuex);
const ModuleFiles = require.context('./modules', true, /(?<!index)\.js$/),
    modules = Import(ModuleFiles, false),
    Store = new Vuex.Store({
        state: {
            // 导航标签
            tabs: [],
            // 提示消息
            alertMessage: [],
            // 菜单
            menu: menus,
        },
        getters: {
            tabs: state => state.tabs,
            alertMessage: state => state.alertMessage,
            menu: state => state.menu,
        },
        mutations: {
            tabPush(state, data) {
                state.tabs.push(data);
            },
            tabDel(state, index) {
                state.tabs.splice(index, 1);
                // 跳转路由
                let length = state.tabs.length,
                    path = length ? state.tabs[length - 1] : '/';
                Router.push({ path });
            },
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
            // 标签触发器
            // 用来命中菜单,添加标签
            tabEmit({ getters, commit }, data) {
                // 查询对象目标字段
                let key = 'url',
                    // 目标菜单
                    menu = R.find(R.propEq(key, data), getters.menu);
                if (!menu) return;
                // 目标标签
                let tab = R.find(R.propEq(key, menu[key]), getters.tabs);
                if (!tab) commit('tabPush', menu);
            },
        },
        modules,
    });

// 空值执行分发请求数据
// empty2Actions:: State a -> Actions b -> State a
export function empty2Actions(state, action) {
    if (R.isEmpty(state)) {
        R.ifElse(
            R.is(Array),
            R.apply(Store.dispatch),
            v => Store.dispatch(v)
        )(action);
    }
    return state;
}

export default Store;
