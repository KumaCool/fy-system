<template lang="html">
    <auto-forms ref="form"
                class="form"
                :data="formData"
                :forms="forms"
                :form-option="formOption"
                layout-column
                flex-row>
        <v-select v-model="formData.gender"
                  :items="gender"
                  item-text="label"
                  item-value="value"
                  outline />
        <template v-for="i in cardCount">
            <v-select :key="'cardType' + i"
                      v-model="formData['type_' + (i - 1)]"
                      :items="cardType"
                      item-text="label"
                      item-value="value"
                      outline />
            <date-picker :key="'validDate' + i" v-model="formData['validDate_' + (i - 1)]" />
        </template>
        <div class="addCard theButton" @click="addCard">
            新增证件+
        </div>
        <div class="buttom">
            <v-btn color="warning" @click="onSubmit">
                确认
            </v-btn>
            <v-btn color="warning" @click="close">
                取消
            </v-btn>
        </div>
    </auto-forms>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    mobileCN,
    notEmpty,
    required,
} from '_js/getters';

export default {
    name: 'UserForm',
    props: {
        value: {
            type: Object,
            required: true,
        },
        show: Boolean,
    },
    data() {
        return {
            formData: {
                loginName: '',
                userName: '',
                englishName: '',
                gender: '',
                age: '',
                // type: '',
                // idCrad: '',
                // validDate: '',
                buyState: '',
            },
            forms: [
                [
                    'loginName',
                    '账号',
                    [mobileCN],
                ],
                [
                    'userName',
                    '姓名',
                    [required],
                ],
                [
                    'englishName',
                    '英文名',
                    [required],
                ],
                ['__', '性别'],
                ['age', '年龄'],
            ],
            formOption: { props: { outline: true } },
            layout: { attrs: { wrap: true } },
            // 证件组计数
            cardCount: 0,
        };
    },
    computed: {
        keys() {
            return [
                'userName',
                'englishName',
                'gender',
                'age',
                'buyState',
                'loginName',
            ];
        },
        pick() {
            return R.pick(this.keys);
        },
        ...mapGetters('storeDictionary', ['gender', 'cardType']),
    },
    watch: {
        value: {
            handler(v) {
                if (R.isEmpty(v)) return;
                if (Array.isArray(v.idCradList)) v.idCradList.forEach(this.addCard);
                this.formData = this.dataAPI2form();
            },
            immediate: true,
        },
    },
    created() {
        this.addCard();
    },
    methods: {
        // 增加证件组配置
        addCard() {
            let i = this.cardCount,
                keys = [
                    'type_' + i,
                    'idCrad_' + i,
                    'validDate_' + i,
                ],
                forms = [
                    ['__', '证件类型'],
                    [keys[1], '证件号'],
                    ['__', '证件有效期'],
                ];
            this.forms = this.forms.concat(forms);
            this.formData = R.mergeRight(
                R.fromPairs(R.map(k => [k, ''], keys)),
                this.formData
            );
            // 添加计数
            this.cardCount++;
        },
        // 格式化接口为表单格式
        dataAPI2form() {
            let cards = this.value.idCradList || [],
                // 拼接键名
                join = R.curry((i, v) => v + '_' + i),
                format = (v, i) => {
                    return R.compose(
                        R.fromPairs,
                        R.map(R.adjust(0, join(i))),
                        R.toPairs
                    )(v);
                },
                cardsFormat = R.compose(
                    R.reduce(R.mergeRight, {}),
                    R.addIndex(R.map)
                )(format, cards);
                // 组装数据
            return R.mergeRight(this.pick(this.value), cardsFormat);
        },
        // 格式化表单为接口格式
        form2DataAPI() {
            // 证件
            let cards = R.omit(this.keys, this.formData),
                split = R.split('_'),
                // 根据尾数分组
                toGroup = v => R.compose(R.last, split)(v[0]),
                // 组合分组数据
                valueFn = (acc, v) => {
                    let arr = R.useWith(
                        R.pair,
                        [R.compose(R.head, split), R.identity]
                    )(...v);
                    return acc.concat([arr]);
                },
                // 排除全空值对象
                exclude = R.compose(notEmpty, R.filter(notEmpty)),
                // 身份证数据
                cardGroup = R.compose(
                    // R.uniq,
                    R.values,
                    R.filter(exclude),
                    R.map(R.fromPairs),
                    R.reduceBy(valueFn, [], toGroup),
                    R.toPairs
                )(cards);
            return {
                ...this.pick(this.formData),
                idCradList: cardGroup,
            };
        },
        onSubmit() {
            if (!this.$refs.form.$children[0].validate()) return;
            return this.$emit('change', this.form2DataAPI());
        },
        close() {
            return this.$emit('close');
        },
    },
};
</script>

<style lang="stylus" scoped>
.form >>>
    .layout .formItem
        padding 4px 0
    .label
        margin-top -28px
        width 80px
        text-align right
    .v-text-field.v-text-field--enclosed .v-text-field__details
        margin-bottom 0
    .addCard
    .buttom
        margin 0 auto
    .addCard
        margin-bottom 15px
        color $_color_secondary
        text-decoration underline
</style>
