import qs from 'qs';
import Axios from 'axios';
import Router from '@/router';
import Store from '@/store';
import Import from '_js/import';
import whileList from './whileList';

// API模块: APIData
const ModuleFiles = require.context('./modules', true, /(?<!index)\.js$/),
    Modules = Import(ModuleFiles, false),
    // 配置
    ConfigFiles = require.context('./', false, /(?<!index)\.js$/),
    Config = Import(ConfigFiles, false),
    Instance = Axios.create();

Instance.defaults.baseURL = Config.server;
Instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
Instance.defaults.withCredentials = true;

// 请求拦截
Instance.interceptors.request.use(request => {
    request.data = qs.stringify(request.data);
    return request;
});

// 返回拦截
Instance.interceptors.response.use(response => {
    let data = response.data;
    if (whileList.code.indexOf(data.code) >= 0 || whileList.url.indexOf(Router.currentRoute.path) >= 0) {
        return data.result;
    } else return errorHandle(data);
}, err => errorHandle(err));

const errorHandle = err => {
    let message = {};
    if (err.response) {
        message.title = err.response.data.status;
        message.context = err.response.data.message;
        // 用户登陆超时
        if (err.response.data.exception && err.response.data.exception.search(/HjlLoginException$/) >= 0) {
            Store.commit('storeUser/signOut');
        }
    } else if (err.code) {
        message.title = err.code;
        message.context = err.msg;
    } else if (err.request) {
        message.title = '网络错误';
        message.context = err.message;
    } else if (err.message) {
        message.title = '接口请求前报错';
        message.context = err.message;
        // eslint-disable-next-line
    } else console.dir(err);
    Store.dispatch('alertMessage', {
        color: 'error',
        content: `${message.title}: ${message.context}`,
    });
    return Promise.reject(message);
};

// 标准化API
// array2length4:: APIData Array -> Array
const array2length4 = api => {
    let length = api.length,
        lastArg = api[length - 1],
        cb = v => v,
        url = api[0],
        request = typeof api[1] === 'function' ? api[1] : cb,
        response = typeof api[2] === 'function' ? api[2] : cb,
        type = typeof lastArg === 'string' && length > 1 ? lastArg : 'post';
    return [
        url,
        request,
        response,
        type,
    ];
};

// 封装Axios
const toAxios = (url, request, response, type) => {
    // 添加Token
    if (Store.getters['storeUser/token']) {
        Instance.defaults.headers.common['Authorization'] = Store.getters['storeUser/token'];
    }
    return Instance[type](url, request).then(response);
};

// 封装API模块
// XXX: 函数式不优雅,待优化
let formatAPI = R.map(
        R.map(
            R.compose(
                v => request => {
                    let lens = R.lensIndex(1),
                        fn = R.view(lens, v),
                        temp = R.compose(
                            R.apply(toAxios),
                            R.set(lens, fn(request))
                        );
                    return temp(v);
                },
                array2length4
            )
        )
    ),
    api = formatAPI(Modules);

export {
    toAxios,
    api,
};
