<script>
import { createHOC } from 'vue-hoc';
import AutoForms from '~/ui/forms';

export default createHOC(AutoForms, { name: 'SelectForms' }, {
    'class': { selectForms: true },
    props: {
        container(props) {
            let data = props.container || {};
            return R.mergeDeepRight({
                attrs: {
                    'ma-0': true,
                    'px-4': true,
                    'py-2': true,
                },
            }, data);
        },
        formOption(props) {
            let data = props.formOption || {};
            return R.mergeDeepRight({ props: { outline: true } }, data);
        },
        layout(props) {
            let data = props.layout || {};
            return R.mergeDeepRight({ attrs: { wrap: true } }, data);
        },
        flex(props) {
            let data = props.flex || {};
            return R.mergeDeepRight({ attrs: { shrink: true } }, data);
        },
    },
});
</script>

<style lang="stylus" scoped>
.selectForms >>>
    background $_color_white
    border-left 9px solid $_color_primary
    radius()
    shadow(0 2px 4px)
    .formItem
        .label
            margin-bottom 0px
            font-weight bold
        .v-input__slot
            margin 0
</style>
