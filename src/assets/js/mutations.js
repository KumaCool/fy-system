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

// 替换对象中指定的键名
// changeKey:: s -> String b -> {b}
export const changeKey = R.curry((key, newKey, obj) => {
    let values = R.values(obj),
        keys = R.keys(obj),
        index = keys.indexOf(key);
    if (index < 0) return obj;
    keys[index] = newKey;
    return R.zipObj(keys, values);
});

// base64转为Blob
export const base64ToBlob = dataurl => {
    let arr = dataurl.split(','),
        // 文件头格式
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

// 保存文件到本地
// fileSave:: s -> Blob a -> s
export const fileSave = R.curry((fileName, data) => {
    let a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(data);
    a.click();
    return fileName;
});

// 在列表中去除或添加值
// changeList:: a -> [a] -> [] | [a]
export const changeList = R.curry((value, list) => {
    let index = R.findIndex(R.identical(value), list);
    return index < 0
        ? R.append(value, list)
        : R.remove(index, 1, list);
});

// 时间格式化
// dateFormat:: a -> s -> s a | null
export const dateFormat = (date, fmt) => {
    date = new Date(date);
    if (isNaN(Date.parse(date))) return null;
    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

// 数据格式化为
// formatList:: a -> b -> c -> C [{b:a}]
export const formatList = R.curry((keys, values, list) => R.map(
    R.compose(
        R.zipObj(keys),
        R.values,
        R.pick(values)
    ),
    list
));
