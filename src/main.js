import Vue from 'vue';
import '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';
import Components from '~/';
import '@/plugins';
import '_css/global.styl';
import App from '@/App.vue';

Vue.config.productionTip = false;

// 加载全局组件
Vue.use(Components);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
