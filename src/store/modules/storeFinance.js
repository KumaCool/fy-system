import { api } from '@/api';
import { base64ToBlob, fileSave } from '_js/mutations';

let state = {};
const getters = {},
    mutations = {},
    actions = {
        // 获取对账单列表
        getCheckBillList(context, data) {
            return api.finance.getCheckBillList(data);
        },
        // 获取对账单详情
        getCheckBillInfo(context, data) {
            return api.finance.getCheckBillInfo(data);
        },
        // 下载对账单文件
        downloadCheckBillFile(context, { id, code }) {
            return api.finance.downloadCheckBillFile(id).then(res => {
                return fileSave(code + '.xls', base64ToBlob(res));
            });
        },
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
