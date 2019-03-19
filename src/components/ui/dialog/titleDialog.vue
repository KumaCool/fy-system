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
    },
    render(h) {
        let props = { ...this.$props },
            className = 'GlobalTitleDialog';
        if (props.contentClass.indexOf(className) < 0) props.contentClass = R.trim(props.contentClass + ' ' + className);
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
                        this.$scopedSlots.default()
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
