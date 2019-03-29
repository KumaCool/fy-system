export default {
    getDictionary: [
        // 字典查询
        'loadData',
        dicType => {
            return { dicType };
        },
    ],
    // 获取热门城市
    getHotCity: [
        'ticket/getHotCity',
        data => data,
        res => res.hotCity,
        { interceptorsResponse: false },
    ],
    // 查询城市
    queryCity: [
        'ticket/searchCity',
        name => {
            return { name };
        },
        res => res.message,
        {
            cancelToken: true,
            interceptorsResponse: false,
        },
    ],
};
