<template lang="html">
    <label class="checkbox">
        <span v-text="label" />
        <input type="checkbox"
               :checked="isChecked(value)"
               :value="value"
               @change="change(value)">
    </label>
</template>

<script>
import { changeList } from '_js/mutations';
export default {
    name: 'MiniCheckbox',
    model: {
        prop: 'inputValue',
        event: 'change',
    },
    props: {
        value: {
            type: [
                String,
                Number,
                Boolean,
            ],
            required: true,
        },
        label: {
            type: String,
            default: '',
        },
        inputValue: {
            type: [
                Array,
                String,
                Boolean,
                Number,
            ],
            default() {
                return [];
            },
        },
        // 翻转标签与选项框位置
        reversal: {
            type: Boolean,
            default: false,
        },
        // 是否单选
        radio: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        change(v) {
            let data = this.radio ? v : changeList(v, this.inputValue);
            this.$emit('change', data);
        },
        isChecked(v) {
            return this.radio
                ? v === this.inputValue
                : this.inputValue.includes(v);
        },
    },
};
</script>

<style lang="stylus" scoped>
.checkbox
    margin: 5px
    display inline-flex
    flex-wrap nowrap
    align-items center
    cursor pointer
    input
        margin 0 5px
</style>
