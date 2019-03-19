<script>
import { createHOC } from 'vue-hoc';
import { VDataTable } from 'vuetify/lib';
export default createHOC(VDataTable, { name: 'ListTable' }, { 'class': { listTable: true } });
</script>

<style lang="stylus" scoped>
.listTable >>>
    thead
        tr:first-child
            height auto
            th
                background $_color_primary
        tr:not(.v-datatable__progress) > th
            padding 10px 24px!important
        th
        th.column.sortable.active
        th.column.sortable.active .v-icon
            color $_color_white
</style>
