// 自动化表单组件
// 根据配置自动生成表单模板

import { createHOC } from 'vue-hoc';
import {
    VForm,
    VContainer,
    VLayout,
    VFlex,
    VTextField,
} from 'vuetify/lib';

export default createHOC(VForm, {
    name: 'AutoForms',
    props: {
        // 表单数据
        data: Object,
        // 表单项标签prop名
        labelKey: {
            type: String,
            default: 'form-label',
        },
        // 表单配置集
        // 通过对象里的'__'字段进行占位操作,可改变slots顺序
        forms: Array,
        // 表单项项配置
        formOption: Object,
        // 组件配置
        container: Object,
        layout: Object,
        flex: Object,
        // 组件快捷配置选项
        // 应用于layout
        layoutColumn: Boolean,
        layoutAlignCenter: Boolean,
        // 应用于flex
        flexRow: Boolean,
    },
    computed: {
        vFormOpt() {
            return R.mergeDeepRight(
                { props: { outline: true } },
                this.formOption || {}
            );
        },
    },
    render(h) {
        // 占位符
        const placeholder = '__',
            container = el => {
                let layoutOpt = {
                    attrs: {},
                    ...this.$props.layout,
                };
                if (this.$props.layoutColumn) layoutOpt.attrs.column = true;
                if (this.$props.layoutAlignCenter) layoutOpt.attrs['align-center'] = true;
                return h(VContainer, { ...this.$props.container }, [h(VLayout, layoutOpt, el)]);
            },
            flex = el => {
                let opt = {
                    class: {
                        formItem: true,
                        row: this.flexRow,
                    },
                    ...this.$props.flex,
                };
                return h(VFlex, opt, [el]);
            },
            div = (el, className) => (<div class={className}>{el}</div>),
            template = (label, value) => flex([div(label, 'label'), div(value)]);
        let defaultSlots = this.$slots.default ? this.$slots.default.filter(v => !v.isComment) : [],
            forms = this.$props.forms || [];
        if (forms.length) {
            forms = forms.map(v => {
                if (!v) return;
                let value = typeof v === 'string' ? [v] : R.clone(v),
                    key = value[0],
                    label = value[1],
                    com = typeof value[2] === 'string' ? value[2] : VTextField,
                    lastValue = value[value.length - 1],
                    lastValueDec = value[value.length - 2],
                    options = typeof lastValueDec === 'object'
                        ? lastValueDec
                        : lastValue,
                    rule = lastValue;
                if (typeof options !== 'object') options = { attrs: { name: key } };
                if (R.type(rule) !== 'Array') rule = [];
                options = R.mergeDeepRight(this.vFormOpt, options);
                if (this.$props.data) {
                    options = R.mergeDeepRight({
                        props: {
                            value: this.$props.data[key],
                            rules: rule,
                        },
                        on: {
                            input: value => {
                                this.$props.data[key] = value;
                            },
                        },
                        ref: 'vForm_' + key,
                    }, options);
                }
                // Slots格式化为标准表单嵌套
                if (key === placeholder) {
                    let slot = defaultSlots.shift();
                    return label
                        ? template(label, slot)
                        : !slot.componentInstance
                            ? flex(slot)
                            : slot;
                } else {
                    return template(label, h(com, options));
                }
            });
        }
        // 将剩余默认插槽格式化为标准表单件
        defaultSlots = defaultSlots.map(slot => {
            return slot.data && slot.data.staticClass === 'spacer' ? slot : flex(slot);
        });
        return h(VForm, {
            props: this.$props,
            attrs: this.$attrs,
            on: this.$listeners,
        }, [container(forms.concat(defaultSlots))]);
    },
});
