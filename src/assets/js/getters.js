// 定义错误并运行判断
// errorMessage:: a -> b -> b | a
export const errorMessage = v => R.when(R.not, () => v);

// 判断是否为国内手机号
// mobileCN:: a -> Boolean | String
export const mobileCN = R.compose(
    errorMessage('请输入正确的手机号'),
    R.test(/^0?(13|14|15|17|18|19)[0-9]{9}$/),
    R.unless(R.is(String), R.toString),
);

// 判断是否为指定长度
// isLength:: Number -> a -> Boolean
export const isLength = v => R.compose(
    R.identical(v),
    v => v.length
);

// 非空判断
// notEmpty:: a -> Boolean
export const notEmpty = R.complement(R.either(R.isNil, R.isEmpty));

// 必填判断
// required:: a -> Boolean | String
export const required = R.compose(errorMessage('不能为空!'), notEmpty);

// 比较两个日期的大小
// relationDate:: Date a -> Date b -> Number
export const relationDate = R.curry((startDate, endDate) => {
    let getTime = v => {
            let d = new Date(v);
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d.getTime();
        },
        startTime = getTime(startDate),
        endTime = getTime(endDate);
    if (startTime === endTime) return 0;
    return startTime > endTime ? 1 : -1;
});

// 获取元素偏移值
// getOffset:: Document a -> {b}
export const getOffset = el => {
    let value = R.pick(['offsetLeft', 'offsetTop'], el),
        parent = el.offsetParent;
    return parent ? R.mergeWith(R.add, value, getOffset(parent)) : value;
};

// 查询指定的父元素,未找到将返回 undefined
// findParent:: Document a -> CSS selectors -> Document b | undefined
export const findParent = R.curry((el, selectors) => {
    let arr = R.splitAt(1, selectors),
        parent = el.parentNode;
    return parent.className.search(arr[1]) >= 0
        || parent.id === arr[1]
        || parent.tagName === selectors.toUpperCase()
        ? parent
        : parent.tagName === 'BODY'
            ? undefined
            : findParent(parent, selectors);
});
