import { api } from '@/api';
import { empty2Actions } from '../';
// import trainDic from '_js/trainDic';

let state = {
    gender: [],
    // 证件类型
    cardType: [],
    // 票状态
    tripType: [],
    // 支付状态
    payType: [],
    // 火车城市
    // trainDic,
    // 热门城市
    hotCity: [],
};
const DIC_ACTION = 'storeDictionary/getDictionary',
    getters = {
        gender: state => empty2Actions(state.gender, [DIC_ACTION, ['gender', 'USER_GENDER']]),
        cardType: state => empty2Actions(state.cardType, [DIC_ACTION, ['cardType', 'ID_CARD_TYPE']]),
        tripType: state => empty2Actions(state.tripType, [DIC_ACTION, ['tripType', 'TRIP_TYPE']]),
        payType: state => empty2Actions(state.payType, [DIC_ACTION, ['payType', 'PAY_STATE']]),
        // trainDic: state => state.trainDic,
        // 查询火车城市
        // getTrain: state => {
        //     let hasValue = v => R.compose(R.any(R.includes(v)), R.values);
        //     return v => R.filter(hasValue(v), state.trainDic);
        // },
        // 热门火车城市
        // trainHotCity: state => R.filter(R.propEq('isHot', '1'), state.trainDic),
        hotCity: state => empty2Actions(state.hotCity, ['storeDictionary/getHotCity']),
        // 查询字典值: 优先查询value字段,如果没有就在label中查询
        // findDic:: [State key, a] -> State a
        findDic: state => {
            return (target, value) => {
                let defaultObj = Object.create(null);
                if (!target || R.isNil(value)) return defaultObj;
                let find = key => R.find(R.propEq(key, value));
                return R.compose(
                    R.when(
                        R.isNil,
                        R.always(defaultObj)
                    ),
                    R.either(find('value'), find('label'))
                )(state[target]);
            };
        },
    },
    mutations = {
        // 从API调用的赋值方法
        API2State(state, data) {
            if (!Array.isArray(data) || data.length !== 2) return;
            state[data[0]] = R.map(R.zipObj(['value', 'label']), data[1]);
        },
        setHotCity(state, data) {
            state.hotCity = data;
        },
    },
    actions = {
        // 字典查询
        getDictionary({ commit }, data) {
            if (!Array.isArray(data) || data.length !== 2) return;
            return api.system.getDictionary(data[1]).then(res => {
                res = res.map(v => [v.dicCode, v.codeValue]);
                commit('API2State', [data[0], res]);
            });
        },
        // 获取热门城市
        getHotCity({ commit }) {
            return api.system.getHotCity().then(res => {
                commit('setHotCity', res);
            });
        },
        // 查询城市
        queryCity(context, data) {
            return api.system.queryCity(data);
        },
    };
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
