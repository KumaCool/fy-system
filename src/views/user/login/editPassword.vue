<template lang="html">
    <auto-forms ref="form"
                class="only editPassword"
                :data="formData"
                :forms="forms"
                :form-option="formOption"
                :container="container"
                layout-column>
        <v-text-field ref="code"
                      v-model="formData.code"
                      name="code"
                      outline
                      :rules="codeRule">
            <template v-slot:append>
                <emit-phone-code class="getCode"
                                 flat
                                 small
                                 :disabled="isEmitCode"
                                 :phone="phone" />
            </template>
        </v-text-field>
        <v-btn block
               large
               color="info"
               @click="onSubmit">
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
    name: 'EditPassword',
    components: { emitPhoneCode },
    data() {
        return {
            formData: {
                mobile: '',
                password: '',
                code: '',
            },
            forms: [
                [
                    'mobile',
                    '手机号',
                    [mobileCN],
                ],
                [
                    'password',
                    '新密码',
                    { props: { type: 'password' } },
                    [
                        R.compose(
                            errorMessage('最小6位字符'),
                            R.lte(6),
                            v => v.length
                        ),
                    ],
                ],
                ['__', '验证码'],
            ],
            formOption: { props: { outline: true } },
            container: {
                attrs: {
                    'pa-0': true,
                    'grid-list-md': true,
                },
            },
        };
    },
    computed: {
        // 是否禁止发送验证码
        isEmitCode() {
            return typeof mobileCN(this.phone) === 'string';
        },
        // 手机号
        phone() {
            return Number(this.formData.mobile);
        },
        // 验证码验证规则
        codeRule() {
            return [
                v => {
                    return R.compose(
                        R.when(
                            R.compose(
                                R.equals('Number'),
                                R.type
                            ),
                            R.T
                        ),
                        errorMessage('请输入4个数字'),
                        R.equals(4),
                        v => v.length
                    )(v);
                },
            ];
        },
    },
    methods: {
        onSubmit() {
            if (this.$refs.form.$children[0].validate()) {
                this.updateUserPassword(this.formData);
                // let post = { loginName: this.formData.mobile };
                // post[this.isPhoneCode ? 'code' : 'password'] = this.formData.password;
                // return this.signIn(post);
            }
        },
        ...mapActions('storeUser', ['updateUserPassword']),
    },
};
</script>

<style lang="stylus" scoped>
@import './css/form'
</style>
