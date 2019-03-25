// 拆分对象中的值
// objSplit:: a -> String | RegExp -> {a: []}
export const objSplit = R.curry((key, sep) => {
    return R.over(
        R.lensProp(key),
        // 如果是空值直接返回空数组
        R.ifElse(R.isNil, R.always([]), R.split(sep))
    );
});

// 查询到满足条件的首个数据用函数转换并替换掉
// 与R.over同理,针对Array
// overList:: a -> b -> [a] -> [b]
export const overList = R.curry((lens, fn, list) => {
    let value = R.find(lens, list),
        index = R.findIndex(lens, list);
    if (!value) return list;
    return R.compose(
        R.insert(index, fn(value)),
        R.remove(index, 1),
    )(list);
});
