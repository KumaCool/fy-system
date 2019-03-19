<template lang="html">
    <v-list class="menuList">
        <my-menu-item v-for="(item, index) in value"
                      :key="index"
                      :value="item"
                      root />
    </v-list>
</template>

<script>
import myMenuItem from './menuItem';
export default {
    name: 'MyMenuList',
    components: { myMenuItem },
    props: {
        value: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="stylus" scoped>
.menuList >>>
    .v-list__tile:not(.v-list__tile--active)
        color $_color_font!important
</style>
