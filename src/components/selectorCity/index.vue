<template lang="html">
    <v-autocomplete ref="selectorCity"
                    :items="dataList"
                    :search-input.sync="query"
                    item-text="label"
                    :item-value="itemValue"
                    no-filter
                    v-bind="$attrs"
                    v-on="$listeners"
                    @blur="autoSetValue">
        <template v-slot:no-data>
            <v-card flat>
                <div>
                    <v-btn v-for="(item, index) in history"
                           :key="index"
                           flat
                           small
                           color="primary">
                        {{ item }}
                    </v-btn>
                </div>
                <v-subheader>热门城市</v-subheader>
                <div>
                    <v-btn v-for="(item, index) in trainHotCity"
                           :key="index"
                           flat
                           small
                           color="primary"
                           @click="buttonSetValue(item)">
                        {{ item.label }}
                    </v-btn>
                </div>
            </v-card>
        </template>
    </v-autocomplete>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'SelectorCity',
    data() {
        return {
            dataList: [],
            // 文本输入值
            query: '',
            // 历史记录
            history: [],
        };
    },
    computed: {
        itemValue() {
            return this.$attrs['item-value'] || 'pinyin';
        },
        ...mapGetters('storeDictionary', [
            'trainDic',
            'getTrain',
            'trainHotCity',
        ]),
    },
    watch: {
        query(v) {
            if (v) return this.select(v);
            this.dataList = [];
        },
    },
    methods: {
        // 自动赋值
        autoSetValue() {
            if (this.dataList.length !== 1) return;
            let getValue = R.compose(R.prop(this.itemValue), R.head);
            this.setValue(getValue(this.dataList));
        },
        setValue(v) {
            this.$emit('input', v);
        },
        // 查询数据
        select(v) {
            this.dataList = this.getTrain(v);
        },
        // 通过按钮选中值
        buttonSetValue(obj) {
            this.dataList = [obj];
            this.autoSetValue();
        },
    },
};
</script>
