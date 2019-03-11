import Vue from 'vue';
import Router from 'vue-router';
import RouterConfig from './common';
import Import from '_js/import';

const Files = require.context('./modules', true, /(?<!index)\.js$/),
    RouterModules = Import(Files);

Vue.use(Router);

export default new Router({ routes: RouterConfig.concat(RouterModules) });
