// 对账单每页显示数
let checkBillRow = 10,
    // 写死用户
    commandDTO = { userId: 10 };
export default {
    // 获取对账单列表
    getCheckBillList: [
        'skipRequest',
        data => {
            if (data.pageTool) checkBillRow = data.pageTool.pageSize;
            data.commandDTO = commandDTO;
            return {
                paramJson: JSON.stringify(data),
                uri: '/fy/finance/steitment/queryCustomerSteitments',
            };
        },
        res => {
            res = JSON.parse(res);
            return {
                totalPage: Math.ceil(res.totalNum / checkBillRow),
                totalCount: res.totalNum,
                list: res.list,
            };
        },
    ],
    // 获取对账单详情
    getCheckBillInfo: [
        'skipRequest',
        data => {
            if (data.pageTool) checkBillRow = data.pageTool.pageSize;
            data.commandDTO = commandDTO;
            return {
                paramJson: JSON.stringify(data),
                uri: '/fy/finance/orderfinance/queryOrderFinancesBySteitmentId',
            };
        },
        res => {
            res = JSON.parse(res);
            return {
                totalPage: Math.ceil(res.totalNum / checkBillRow),
                totalCount: res.totalNum,
                list: res.list,
            };
        },
    ],
    // 下载对账单文件
    downloadCheckBillFile: [
        'skipRequest',
        steitmentIdList => {
            let data = {
                steitmentIdList,
                commandDTO,
            };
            return {
                paramJson: JSON.stringify(data),
                uri: '/fy/finance/steitment/loadExcelBySteitmentId',
            };
        },
    ],
    // 获取消费记录
    getExpenseSheet: ['trip_account/queryTripAccountByCondition'],
};
