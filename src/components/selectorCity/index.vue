<template lang="html">
    <v-autocomplete ref="selectorCity"
                    :items="dataList"
                    :search-input.sync="query"
                    :item-text="itemKey.label"
                    :item-value="itemKey.value"
                    no-filter
                    v-bind="$attrs"
                    v-on="$listeners"
                    @blur="autoSetValue">
        <template v-slot:no-data>
            <v-card flat :max-width="470">
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
                    <v-btn v-for="(item, index) in hotCity"
                           :key="index"
                           flat
                           small
                           color="primary"
                           @click="buttonSetValue(item)">
                        {{ item[itemKey.label] }}
                    </v-btn>
                </div>
            </v-card>
        </template>
    </v-autocomplete>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'SelectorCity',
    data() {
        return {
            dataList: [],
            // 文本输入值
            query: '',
            // 历史记录
            history: [],
            timeout: null,
        };
    },
    computed: {
        itemKey() {
            return {
                label: this.$attrs['item-text'] || 'name',
                value: this.$attrs['item-value'] || 'id',
            };
        },
        ...mapGetters('storeDictionary', ['hotCity']),
    },
    watch: {
        query(v) {
            if (v) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => this.select(v), 1000);
            }
            this.dataList = [];
        },
    },
    methods: {
        // 自动赋值
        autoSetValue() {
            if (this.dataList.length !== 1) return;
            let getValue = R.compose(R.prop(this.itemKey.value), R.head);
            this.setValue(getValue(this.dataList));
        },
        setValue(v) {
            this.$emit('input', v);
        },
        // 查询数据
        select(v) {
            return this.queryCity(v).then(res => {
                this.dataList = res;
            });
        },
        // 通过按钮选中值
        buttonSetValue(obj) {
            this.dataList = [obj];
            this.autoSetValue();
        },
        ...mapActions('storeDictionary', ['queryCity']),
    },
};
</script>
