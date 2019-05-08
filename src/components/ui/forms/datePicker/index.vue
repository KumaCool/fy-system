<template lang="html">
    <v-menu ref="menu"
            v-model="show"
            full-width
            lazy
            offset-y
            max-width="290px"
            min-width="290px"
            :nudge-right="40"
            :close-on-content-click="false">
        <template v-slot:activator="{on}">
            <v-text-field v-bind="inputAttrsObj"
                          readonly
                          :value="inputValue"
                          :disabled="disabled"
                          v-on="{...on, ...inputListeners}" />
        </template>
        <v-date-picker v-if="!showTime"
                       v-model="dateValue"
                       v-bind="attrs"
                       scrollable
                       @change="toChange" />
        <v-time-picker v-else
                       v-model="timeValue"
                       use-seconds
                       v-bind="timeAttrs"
                       @change="change" />
    </v-menu>
</template>

<script>
import { dateFormat } from '_js/mutations';
export default {
    name: 'DatePicker',
    props: {
        value: { required: true },
        // 清空按钮
        clearable: Boolean,
        // 文本框属性配置
        inputAttrs: {
            type: Object,
            default() {
                return { outline: true };
            },
        },
        // 文本框事件配置
        inputListeners: {
            type: Object,
            default() {
                return {};
            },
        },
        // 是否使用时分秒
        time: Boolean,
        // 时间格式化
        format: {
            type: String,
            default() {
                return this.time ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd';
            },
        },
        // 禁用
        disabled: Boolean,
    },
    data() {
        return {
            show: false,
            showTime: false,
            dateValue: '',
            timeValue: '',
        };
    },
    computed: {
        // 文本值
        inputValue() {
            let value = this.dateValue;
            if (this.timeValue) value += ' ' + this.timeValue;
            return dateFormat(value, this.format) || '';
        },
        // 文本框属性配置
        inputAttrsObj() {
            let attrs = { clearable: this.clearable };
            return R.mergeDeepLeft(this.inputAttrs, attrs);
        },
        // 选择器属性
        attrs() {
            let attrs = {
                // 'no-title': true,
                locale: 'zh-cn',
            };
            return R.mergeDeepLeft(this.$attrs, attrs);
        },
        timeAttrs() {
            return {};
        },
    },
    watch: {
        value: {
            handler(v) {
                this.dateFormat(v);
            },
            immediate: true,
        },
        inputValue(v) {
            this.$emit('input', v);
            this.$emit('change', v);
        },
    },
    methods: {
        // 格式化时间
        dateFormat(v) {
            let value = dateFormat(v, this.format);
            if (!value) {
                this.dateValue = '';
                this.timeValue = '';
                return;
            }
            value = value.split(' ');
            this.dateValue = value[0];
            this.timeValue = value[1];
        },
        toChange() {
            if (this.time) {
                this.showTime = true;
            } else this.change();
        },
        change() {
            this.$refs.menu.save(this.inputValue);
            this.showTime = false;
        },
    },
};
</script>
