<template lang="html">
    <v-container pa-5
                 fluid
                 fill-height
                 class="home">
        <v-layout column>
            <v-flex shrink>
                <v-toolbar class="toolbar"
                           flat>
                    <!-- <v-list class="logoMain">
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-title class="logo">
                                    <img src="~_img/home/logo.png">
                                    <i>FENGYI</i>
                                </v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar class="button" size>
                                <v-btn flat
                                       icon
                                       color="primary"
                                       @click="changeMiniMenu">
                                    <v-icon>iconfont icon-menu</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                        </v-list-tile>
                    </v-list> -->
                    <v-toolbar-title class="newLogoMain">
                        <img src="~_img/home/logo.png">
                        <i>FENGYI</i>
                        <div class="menuButton">
                            <v-btn flat
                                   icon
                                   color="primary"
                                   @click="changeMiniMenu">
                                <v-icon>iconfont icon-menu</v-icon>
                            </v-btn>
                        </div>
                    </v-toolbar-title>
                    <v-spacer />
                    <v-toolbar-items>
                        <v-btn flat
                               icon
                               color="primary"
                               @click="signOut">
                            <v-icon>iconfont icon-out</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
            </v-flex>
            <v-flex grow>
                <v-layout row fill-height>
                    <v-flex shrink hidden-md-and-down>
                        <v-navigation-drawer class="nav"
                                             permanent
                                             stateless
                                             :value="true"
                                             :mini-variant="miniMenu">
                            <my-menu class="menu" :value="menuTree" />
                        </v-navigation-drawer>
                    </v-flex>
                    <v-flex md12>
                        <v-content>
                            <v-tabs class="tabs">
                                <v-tab v-for="(item, index) in tabs"
                                       :key="index"
                                       :to="{path: item.url}">
                                    {{ item.title }}
                                    <v-btn class="close"
                                           flat
                                           icon
                                           small
                                           @click.prevent="$store.commit('tabDel', index)">
                                        <v-icon small>
                                            close
                                        </v-icon>
                                    </v-btn>
                                </v-tab>
                                <v-tabs-items class="tabsMain">
                                    <router-view />
                                </v-tabs-items>
                            </v-tabs>
                        </v-content>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import myMenu from '~/menuList';
export default {
    name: 'Home',
    components: { myMenu },
    data() {
        return { miniMenu: false };
    },
    computed: {
        // 菜单树
        menuTree() {
            // 父级字段
            let idKey = 'id',
                parentKey = 'pid',
                childrenKey = 'children',
                // 根标识
                root = 0,
                // 分组
                groupBy = R.reduceBy(
                    (acc, value) => acc.concat(value),
                    [],
                    R.view(R.lensProp(parentKey))),
                // 分组集
                groupList = groupBy(this.menu);
            Object.keys(groupList).forEach(k => {
                groupList[k].forEach(item => {
                    let id = item[idKey];
                    if (groupList[id]) item[childrenKey] = groupList[id];
                });
            });
            return groupList[root];
        },
        ...mapGetters(['tabs', 'menu']),
    },
    methods: {
        // 切换菜单
        changeMiniMenu() {
            this.miniMenu = !this.miniMenu;
        },
        ...mapMutations('storeUser', ['signOut']),
    },
};
</script>

<style lang="stylus" scoped>
.home > .layout
    background $_color_white
    $topHeight = 50px
    $border = 1px solid $_color_border_home
    .newLogoMain
        padding-left 18px
        width 185px
        box-sizing border-box
        display flex
        align-items center
        color $_color_primary
        font-size 16px
        font-weight bold
        img
            margin-right 10px
            size(24px)
        i
            flex auto
            // text-align right
        .menuButton
            border 0px solid $_color_border_home
            border-left-width 1px
            border-right-width 1px
    .toolbar >>>
        height $topHeight
        background-color $_color_white
        border-bottom $border
        box-sizing content-box
        & > .v-toolbar__content
            padding 0
            height $topHeight!important
    .nav
        max-width 185px
        .logoMain >>>
            padding 0
            border-bottom $border
            .v-list__tile
                padding 0
                height $topHeight
        .logo
            padding-left 18px
            color $_color_primary
            font-size 16px
            font-weight bold
            display flex
            img
                margin-right 10px
                size(24px)
        .menu
            padding 0
    .main
        display flex
        flex-direction column
        .toolbar >>>
            height $topHeight
            background-color $_color_white
            border-bottom $border
            box-sizing content-box
            & > .v-toolbar__content
                padding 0
                height $topHeight!important
        .tabs
            flex auto
            display flex
            flex-direction column
            .tabsMain >>>
                flex auto
                .v-window__container
                    height 100%
                    background $_color_background_home
            .close
                margin-right 0
    .button
        border 0px solid $_color_border_home
        border-left-width 1px
        border-right-width 1px
</style>
