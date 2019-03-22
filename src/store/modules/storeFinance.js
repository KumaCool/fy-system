import { api } from '@/api';

let state = {};
const getters = {},
    mutations = {},
    actions = {
        // 获取消费记录
        getExpenseSheet(context, data) {
            return api.finance.getExpenseSheet(data);
        },
    };
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
