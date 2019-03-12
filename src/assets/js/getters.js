// 定义错误并运行判断
// errorMessage:: a -> b -> Boolean | a
export const errorMessage = v => R.when(R.not, () => v);

// 判断是否为国内手机号
// mobileCN:: a -> Boolean | String
export const mobileCN = R.compose(
    errorMessage('请输入正确的手机号'),
    R.test(/0?(13|14|15|17|18|19)[0-9]{9}/),
    R.toString,
);

// 判断是否为指定长度
// isLength:: Number -> a -> Boolean
export const isLength = v => R.compose(
    R.identical(v),
    v => v.length
);