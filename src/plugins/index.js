import Vue from 'vue';
import Import from '_js/import';
// 排除index.js和vuetify.js文件
const ModuleFiles = require.context('./', true, /(?<!(index|vuetify))\.js$/),
    Modules = Import(ModuleFiles);

// 自动注册插件
Modules.forEach(v => {
    Vue.use(v);
});
