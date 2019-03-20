<script>
import { createHOC } from 'vue-hoc';
import {
    VDialog, VCard, VCardTitle, VCardText,
} from 'vuetify/lib';

export default createHOC(VDialog, {
    name: 'titleDialog',
    props: {
        title: String,
        // 内容的高
        contentHeight: String,
        // 每次弹窗渲染
        renderEvery: Boolean,
    },
    render(h) {
        let props = { ...this.$props },
            className = 'GlobalTitleDialog',
            children = this.$scopedSlots.default();
        if (props.contentClass.indexOf(className) < 0) props.contentClass = R.trim(props.contentClass + ' ' + className);
        // 判断是否每次弹窗渲染
        if (this.renderEvery && !this.$attrs.value) children = [];
        return h(
            VDialog,
            {
                props,
                attrs: this.$attrs,
                on: this.$listeners,
            },
            [
                h(VCard, [
                    h(VCardTitle, this.$props.title),
                    h(
                        VCardText,
                        { style: { height: this.$props.contentHeight } },
                        children
                    ),
                ]),
            ]
        );
    },
});
</script>

<style lang="stylus">
.GlobalTitleDialog
    .v-card__title
        padding 10px
        background $_color_primary
        color $_color_white
        justify-content center
</style>
