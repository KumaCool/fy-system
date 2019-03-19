<template lang="html">
    <v-menu>
        <template v-slot:activator="{on}">
            <v-text-field v-bind="inputAttrs"
                          :value="value"
                          v-on="{...on, ...inputListeners}" />
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
        // 选择器属性
        attrs() {
            let attrs = {
                'no-title': true,
                locale: 'zh-cn',
            };
            return  R.mergeDeepLeft(this.$attrs, attrs);
        },
    },
};
</script>
