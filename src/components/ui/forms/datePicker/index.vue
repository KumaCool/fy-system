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
                          :value="value"
                          @blur="input(value)"
                          @input="input"
                          v-on="{...on, ...inputListeners}" />
        </template>
        <v-date-picker v-bind="attrs"
                       scrollable
                       v-on="$listeners"
                       @change="change" />
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
    data() {
        return { show: false };
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
        input(v) {
            let d = new Date(v);
            if (!v || d.toString() === 'Invalid Date') v = '';
            this.$emit('input', v);
            this.$emit('change', v);
        },
        change(v) {
            this.$refs.menu.save(v);
        },
    },
};
</script>
