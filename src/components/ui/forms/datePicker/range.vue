<template lang="html">
    <div class="dateRange">
        <date-picker :value="start"
                     clearable
                     @change="change('startDate', $event)" />
        <span class="label">至</span>
        <date-picker :value="end"
                     clearable
                     :allowed-dates="allowedDates(start)"
                     @change="change('endDate', $event)" />
    </div>
</template>

<script>
import { relationDate } from '_js/getters';
export default {
    name: 'DatePickerRange',
    props: {
        value: {
            type: Array,
            default() {
                return new Array(2);
            },
        },
        startDate: {
            type: [String, Object],
            default: '',
        },
        endDate: {
            type: [String, Object],
            default: '',
        },
    },
    computed: {
        start() {
            return this.value[0] || this.startDate;
        },
        end() {
            return this.value[1] || this.endDate;
        },
    },
    watch: {
        start(v) {
            if (!v && this.endDate) this.change('endDate', v);
        },
    },
    methods: {
        change(type, v) {
            this.$emit('update:' + type, v);
            this.$emit('input', [this.start, this.end]);
        },
        // 允许操作的时间
        allowedDates(date) {
            return v => {
                if (!date) return true;
                let rel = relationDate(date);
                return rel(v) < 0;
            };
        },
    },
};
</script>

<style lang="stylus" scoped>
.dateRange
    display flex
    align-items: baseline;
    .label
        margin-left 10px
</style>
