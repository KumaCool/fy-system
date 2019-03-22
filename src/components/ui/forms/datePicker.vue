<template lang="html">
    <v-menu>
        <template v-slot:activator="{on}">
            <v-text-field v-bind="inputAttrsObj"
                          :value="value"
                          v-on="{...on, ...inputListeners}"
                          @input="change" />
        </template>
        <v-date-picker v-bind="attrs"
                       v-on="$listeners" />
    </v-menu>
</template>

<script>
export default {
    name: 'DatePicker',
    props: {
        value: {
            type: String,
            required: true,
        },
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
    },
    computed: {
        // 文本框属性配置
        inputAttrsObj() {
            let attrs = { clearable: this.clearable };
            return R.mergeDeepLeft(this.inputAttrs, attrs);
        },
        // 选择器属性
        attrs() {
            let attrs = {
                'no-title': true,
                locale: 'zh-cn',
            };
            return R.mergeDeepLeft(this.$attrs, attrs);
        },
    },
    methods: {
        change(v) {
            this.$emit('input', v || '');
        },
    },
};
</script>
