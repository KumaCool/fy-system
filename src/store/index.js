import Vue from 'vue';
import Vuex from 'vuex';
import Import from '_js/import';
import Router from '@/router';
import menus from './menu';
import { overList } from '_js/mutations';

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
            },
            alertMessagePush(state, data) {
                state.alertMessage.push(data);
            },
            alertMessageDel(state, index) {
                state.alertMessage.splice(index, 1);
            },
            setMenu(state, data) {
                state.menu = data;
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
            tabEmit({
                getters,
                commit,
                dispatch,
            }, data) {
                // 查询对象目标字段
                let key = 'url',
                    // 目标菜单
                    menu = R.find(R.propEq(key, data), getters.menu);
                if (!menu) return;

                // 目标标签
                let tab = R.find(R.propEq(key, menu[key]), getters.tabs);
                if (!tab) {
                    dispatch('updateMenuActive', menu);
                    commit('tabPush', menu);
                }
            },
            // 删除标签
            tabDel({
                getters,
                commit,
                dispatch,
            }, index) {
                commit('tabDel', index);
                // 跳转路由
                let length = getters.tabs.length,
                    path = '/';
                if (length) {
                    let menu = getters.tabs[length - 1];
                    path = menu.url;
                    dispatch('updateMenuActive', menu);
                }
                Router.push({ path });
            },
            // 更新菜单激活状态
            updateMenuActive({ getters, commit }, data) {
                let activeKey = 'active',
                    lensProp = R.lensProp(activeKey),
                    // 变更菜单激活状态
                    menuList = R.compose(
                    // 激活当前菜单父级
                        overList(
                            R.propEq('id', data.pid),
                            R.over(lensProp, R.T),
                        ),
                        // 关闭已激活菜单
                        overList(
                            R.propEq(activeKey, true),
                            R.over(lensProp, R.F),
                        )
                    )(getters.menu);
                commit('setMenu', menuList);
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
