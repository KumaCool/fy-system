// 拆分对象中的值
// objSplit:: a -> String | RegExp -> {a: []}
export const objSplit = R.curry((key, sep) => {
    return R.over(
        R.lensProp(key),
        // 如果是空值直接返回空数组
        R.ifElse(R.isNil, R.always([]), R.split(sep))
    );
});
