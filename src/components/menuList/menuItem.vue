<template lang="html">
    <v-list-group v-if="value[children] && Array.isArray(value[children])"
                  v-model="value.active"
                  :sub-group="!root"
                  class="group">
        <template v-slot:activator>
            <my-menu-item :value="noHasChildren" />
        </template>
        <my-menu-item v-for="(item, index) in value[children]"
                      :key="index"
                      :value="item" />
    </v-list-group>
    <v-list-tile v-else :to="value[url] ? {path: value[url]} : ''">
        <v-list-tile-action class="menuIcon">
            <v-icon v-show="value[icon]">
                iconfont {{ value[icon] }}
            </v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
            <v-list-tile-title v-text="value[title]" />
        </v-list-tile-content>
    </v-list-tile>
</template>

<script>
export default {
    name: 'MyMenuItem',
    props: {
        // 根级标识
        root: Boolean,
        value: {
            type: Object,
            required: true,
        },
        structure: {
            type: Array,
            default() {
                return [
                    'title',
                    'children',
                    'icon',
                    'url',
                ];
            },
        },
    },
    computed: {
        title() {
            return this.structure[0];
        },
        children() {
            return this.structure[1];
        },
        icon() {
            return this.structure[2];
        },
        url() {
            return this.structure[3];
        },
        path() {
            let path = this.value[this.url];
            return path === false ? path : { path };
        },
        // 不含有子集的数据
        noHasChildren() {
            return R.dissocPath(['children'], this.value);
        },
    },
};
</script>

<style lang="stylus" scoped>
.group >>>
    .v-list__group__header .v-list__group__header__append-icon
        padding 5px
.menuIcon
    margin-right 10px
    size(20px)
    min-width auto
    .v-icon
        font-size 20px
</style>
