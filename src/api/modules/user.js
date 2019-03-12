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
};
