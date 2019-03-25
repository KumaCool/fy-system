import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '_css/vuetify.styl';

Vue.use(Vuetify, {
    theme: {
        primary: '#A36CC7',
        secondary: '#048BF4',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
    },
    iconfont: 'md',
});
