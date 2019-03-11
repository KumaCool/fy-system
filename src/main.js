import Vue from 'vue';
import '@/plugins/vuetify';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import Components from '~/';

Vue.config.productionTip = false;

// 加载全局组件
Vue.use(Components);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
