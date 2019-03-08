// 自动处理由require.context获取的数据模块.
export default function(files, toArray = true) {
    let modules = toArray ? [] : {};
    files.keys().forEach(key => {
        let data = files(key).default;
        if (!toArray) {
            let name = key.match(/(.*\/)*([^.]+).*/)[2];
            return modules[name] = data;
        }
        modules = modules.concat(data);
    });
    return modules;
}
