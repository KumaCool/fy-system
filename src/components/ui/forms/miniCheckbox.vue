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
            default: true,
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
        // label可点击
        labelClick: Function,
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
            let data = this.radio
                ? this.inputValue === v ? '' : v
                : changeList(v, this.inputValue);
            this.$emit('change', data);
        },
        isChecked(v) {
            return this.radio
                ? v === this.inputValue
                : this.inputValue.includes(v);
        },
    },
    render(h) {
        let tag = 'label',
            labelClick = () => {};
        if (this.labelClick) {
            tag = 'div';
            labelClick = this.labelClick;
        }
        return h(tag, { class: 'checkbox' }, [
            (<span onClick={labelClick}>{this.label}</span>),
            (<input type="checkbox"
                checked={this.isChecked(this.value)}
                value={this.value}
                onChange={() => this.change(this.value)} />),
        ]);
    },
};
</script>

<style lang="stylus" scoped>
.checkbox
    margin: 5px
    display inline-block
    flex-wrap nowrap
    align-items center
    cursor pointer
    input
        margin 0 5px
</style>
