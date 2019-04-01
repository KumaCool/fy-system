<template lang="html">
    <auto-forms ref="form"
                class="only signIn"
                lazy-validation
                :data="formData"
                :forms="forms"
                :form-option="formOption"
                layout-column
                @submit.prevent="onSubmit">
        <v-text-field v-model="formData.password"
                      name="password"
                      :type="isPhoneCode ? 'text' : 'password'"
                      :rules="passwordRule"
                      outline>
            <template v-if="isPhoneCode" v-slot:append>
                <emit-phone-code class="getCode"
                                 flat
                                 small
                                 :disabled="!phone"
                                 :phone="phone" />
            </template>
        </v-text-field>
        <div v-if="isPhoneCode" class="other">
            <span class="theButton" @click="changePhoneCode">账号密码登陆</span>
        </div>
        <div v-else class="other">
            <a class="theButton" @click="changePhoneCode">验证码登陆</a>
            <router-link class="theButton" :to="{ name: 'editPassword' }">
                修改密码
            </router-link>
        </div>
        <v-btn block
               large
               color="info"
               type="submit">
            登陆
        </v-btn>
    </auto-forms>
</template>

<script>
import { mapActions } from 'vuex';
import {
    mobileCN,
    errorMessage,
} from '_js/getters';
import emitPhoneCode from '@/views/user/login/emitPhoneCode';

export default {
    name: 'SignIn',
    components: { emitPhoneCode },
    data() {
        return {
            formData: {
                mobile: '',
                password: '',
            },
            formOption: { props: { outline: true } },
            isPhoneCode: false,
        };
    },
    computed: {
        forms() {
            return [
                [
                    'mobile',
                    '账号',
                    [mobileCN],
                ],
                ['__', this.isPhoneCode ? '验证码' : '密码'],
            ];
        },
        // 手机号
        phone() {
            return Number(this.formData.mobile);
        },
        // 密码与验证码验证规则
        passwordRule() {
            return [
                v => {
                    // 密码验证
                    let pw = R.compose(
                            errorMessage('最小6位字符'),
                            R.lte(6)
                        ),
                        // 验证码验证
                        code = R.compose(
                            errorMessage('请输入4个数字'),
                            R.equals(4)
                        ),
                        length = v.length,
                        res = this.isPhoneCode ? code(length) : pw(length);
                    return R.when(
                        R.compose(
                            R.equals('Number'),
                            R.type
                        ),
                        R.T
                    )(res);
                },
            ];
        },
    },
    methods: {
        // 切换验证码登陆
        changePhoneCode() {
            this.isPhoneCode = !this.isPhoneCode;
            this.formData.password = '';
            this.resetRule();
        },
        // 重置校验
        resetRule() {
            this.$refs.form.$children[0].resetValidation();
        },
        onSubmit() {
            if (this.$refs.form.$children[0].validate()) {
                let post = { loginName: this.formData.mobile };
                post[this.isPhoneCode ? 'code' : 'password'] = this.formData.password;
                return this.signIn(post);
            }
        },
        ...mapActions('storeUser', ['signIn']),
    },
};
</script>

<style lang="stylus" scoped>
@import './css/form'
.other
    display flex
    justify-content space-between
</style>
