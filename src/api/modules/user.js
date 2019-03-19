export default {
    // 登录
    signIn: ['login'],
    // 修改用户密码
    updateUserPassword: ['user/changePwd'],
    // 发送验证码
    emitPhoneCode: [
        'sms/sendCode',
        mobile => {
            return { mobile };
        },
    ],
    // 获取用户列表
    getUserList: ['user/queryAll'],
    // 添加用户
    addUser: ['user/add'],
    // 编辑用户
    updateUser: ['user/edit'],
};
