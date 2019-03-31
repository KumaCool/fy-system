import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store';
import RouterConfig from './common';
import Import from '_js/import';

Vue.use(Router);

const Files = require.context('./modules', true, /(?<!index)\.js$/),
    RouterModules = Import(Files),
    router = new Router({ routes: RouterConfig.concat(RouterModules) });

router.beforeEach((to, from, next) => {
    // 检测是否登陆
    if (!Store.getters['storeUser/token']
        && ['signIn', 'editPassword'].indexOf(to.name) < 0) return next('/login');
    // 进入的路由是否已存在标签
    let hasTab = R.findIndex(R.propEq('url', to.path), Store.getters.tabs) >= 0;
    to.meta.keepAlive = hasTab;
    // 加入标签
    if (!hasTab) Store.dispatch('tabEmit', to.path);
    next();
});

export default router;
