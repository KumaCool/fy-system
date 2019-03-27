<script>
import { createHOC } from 'vue-hoc';
import { VPagination } from 'vuetify/lib';
export default createHOC(VPagination, {
    name: 'autoPage',
    render(h) {
        let com = h(VPagination, {
            props: this.$props,
            attrs: this.$attrs,
            on: this.$listeners,
            scopedSlots: this.$scopedSlots,
        });
        return (<div class="page">{com}</div>);
    },
});
</script>

<style lang="stylus" scoped>
.page >>>
    margin 0 auto
    text-align center
    .v-pagination
        padding 5px
        shadow()
        background $_color_white
        .v-pagination__navigation
        .v-pagination__item
            size(28px, 'height')
            min-width 28px
            background $_color_background_page
            shadow(none)
</style>
