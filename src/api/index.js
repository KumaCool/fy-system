import qs from 'qs';
import Axios from 'axios';
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
    // 判断是否拦截处理
    if (request.interceptorsRequest === false) {
        request = R.omit('interceptorsRequest', request);
    } else request.data = qs.stringify(request.data);
    return request;
});

// 返回拦截
Instance.interceptors.response.use(response => {
    let data = response.data,
        url = response.config.url.replace(response.config.baseURL + '/', '');
    // 判断是否拦截处理
    if (response.config.interceptorsResponse === false) {
        return data;
    } else if (whileList.code.indexOf(data.code) >= 0 || whileList.url.indexOf(url) >= 0) {
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
// formatArg2API:: APIData Array -> Array
const formatArg2API = api => {
    if (typeof api[0] !== 'string') throw new Error('API格式错误,首个元素必须为字符串');
    // 注意: 该对象顺序会影响其它函数
    let data = {
            type: 'post',
            response: v => v,
            url: api[0],
            request: v => v,
            config: {},
        },
        keySelector = (v, i) => {
            return R.cond([
                [R.allPass([R.is(Function), R.always(R.equals(1, i))]), R.always('response')],
                [R.is(Function), R.always('request')],
                [R.is(String), R.always('type')],
                [R.is(Object), R.always('config')],
            ])(v);
        };
    R.tail(api).forEach((v, i) => {
        let key = keySelector(v, i);
        if (key) data[key] = v;
    });
    return R.values(data);
};

// 封装Axios
const toAxios = (type, response, ...args) => {
    // 添加Token
    if (Store.getters['storeUser/token']) {
        Instance.defaults.headers.common['Authorization'] = Store.getters['storeUser/token'];
    }
    return R.apply(Instance[type], args).then(response);
};
// 封装API模块
// XXX: 函数式不优雅,待优化
let formatAPI = R.map(
        R.map(
            R.compose(
                v => request => {
                    // 聚焦 request
                    let lensIndex = R.lensIndex(3),
                        fn = R.view(lensIndex, v),
                        value = R.set(lensIndex, fn(request), v);
                    return R.apply(toAxios, value);
                },
                formatArg2API,
            )
        )
    ),
    api = formatAPI(Modules);

export {
    formatArg2API,
    toAxios,
    api,
};
