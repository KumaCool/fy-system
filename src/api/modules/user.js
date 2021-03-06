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
    // 导入用户文件
    importUserFile: [
        'user/importExcelUserInfo',
        files => {
            let data = new FormData();
            data.append('file', files[0]);
            data.append('interceptors', false);
            return data;
        },
        {
            headers: { 'Content-Type': 'multipart/form-data' },
            interceptorsRequest: false,
        },
    ],
    // 获取用户列表
    getUserList: ['user/queryAll'],
    // 添加用户
    addUser: ['user/add'],
    // 编辑用户
    updateUser: ['user/edit'],
};
