<template lang="html">
    <v-btn v-bind="$attrs"
           :disabled="disabled"
           v-on="$listeners"
           @click="onSubmit">
        {{ buttonText }}
    </v-btn>
</template>

<script>
export default {
    name: 'EmitPhoneCode',
    props: {
        // 手机号
        phone: {
            type: Number,
            required: true,
        },
        // 锁定时间
        lockTime: {
            type: Number,
            default: 60,
        },
    },
    data() {
        return {
            btnLock: false,
            timeOut: 60,
        };
    },
    computed: {
        // 按钮禁用
        disabled() {
            return this.$attrs.disabled || this.btnLock;
        },
        // 按钮文字
        buttonText() {
            let text = '获取验证码';
            if (this.$attrs.disabled) return text;
            return this.disabled ? `已发送(${this.timeOut})` : text;
        },
    },
    watch: {
        lockTime: {
            handler(v) {
                let timeout = localStorage.getItem(this.__uid);
                this.timeOut = timeout || v;
                // 刷新页面继续执行
                timeout && this.countdown();
            },
            immediate: true,
        },
    },
    methods: {
        // 倒计时
        countdown() {
            this.btnLock = true;
            let timeout = setInterval(() => {
                if (this.timeOut < 1) {
                    this.btnLock = false;
                    this.timeOut = this.lockTime;
                    clearTimeout(timeout);
                    localStorage.removeItem(this.__uid);
                } else {
                    this.timeOut--;
                    localStorage.setItem(this.__uid, this.timeOut);
                }
            }, 1000);
        },
        onSubmit() {
            this.countdown();
            this.$store.dispatch('storeUser/emitPhoneCode', this.phone);
        },
    },
};
</script>

<style lang="css" scoped>
</style>
