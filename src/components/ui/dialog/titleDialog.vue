<script>
import { createHOC } from 'vue-hoc';
import {
    VDialog, VCard, VCardTitle, VCardText, VBtn, VIcon,
} from 'vuetify/lib';

export default createHOC(VDialog, {
    name: 'titleDialog',
    props: {
        title: String,
        // 内容的高
        contentHeight: [String, Number],
        // 每次弹窗渲染
        renderEvery: Boolean,
        // 关闭按钮
        close: Boolean,
    },
    computed: {
        // 格式化内容的高
        contentHeightFormat() {
            if (!this.contentHeight) return '';
            return typeof this.contentHeight === 'number'
                || !this.contentHeight.includes('px')
                ? this.contentHeight + 'px'
                : this.contentHeight;
        },
    },
    render(h) {
        let props = { ...this.$props },
            className = 'GlobalTitleDialog',
            children = this.$scopedSlots.default ? this.$scopedSlots.default() : [];
        if (props.contentClass.indexOf(className) < 0) props.contentClass = R.trim(props.contentClass + ' ' + className);
        // 判断是否每次弹窗渲染
        if (this.renderEvery && !this.$attrs.value) children = [];
        return h(
            VDialog,
            {
                props,
                attrs: this.$attrs,
                on: {
                    keydown: e => {
                        if (e.keyCode === 27) this.$emit('input', false);
                    },
                    ...this.$listeners,
                },
            },
            [
                h(VCard, [
                    h(VCardTitle, [
                        this.$props.title,
                        h(VBtn, {
                            attrs: {
                                flat: true,
                                icon: true,
                                small: true,
                            },
                            on: { click: () => (this.$emit('input', false)) },
                        }, [h(VIcon, 'close')]),
                    ]),
                    h(
                        VCardText,
                        { style: { 'max-height': this.contentHeightFormat } },
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
        position relative
        padding 10px
        background $_color_primary
        color $_color_white
        justify-content center
        button
            position absolute
            top 2px
            right 0
            color $_color_white
</style>
