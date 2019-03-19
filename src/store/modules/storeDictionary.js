let state = {
    gender: [
        {
            label: '男',
            value: 1,
        },
        {
            label: '女',
            value: 0,
        },
    ],
    // 证件类型
    cardType: [
        {
            label: '身份证',
            value: 0,
        },
    ],
};
const getters = {
        gender: state => state.gender,
        cardType: state => state.cardType,
        // 查询字典值: 优先查询value字段,如果没有就在label中查询
        // findDic:: [State key, a] -> State a
        findDic: state => {
            return (target, value) => {
                if (!target || R.isNil(value)) return null;
                let find = key => R.find(R.propEq(key, value));
                return R.compose(
                    R.when(
                        R.isNil,
                        () => Object.create(null)
                    ),
                    R.either(find('value'), find('label'))
                )(state[target]);
            };
        },
    },
    mutations = {},
    actions = {};
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
