<template lang="html">
    <v-container pa-5
                 fluid
                 fill-height
                 class="home">
        <v-layout column>
            <v-flex shrink>
                <v-toolbar class="toolbar"
                           flat>
                    <v-toolbar-title class="logoMain">
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
                        <div v-if="userInfo" class="userInfo">
                            <span v-text="userInfo.userName" />
                            <span class="mobile" v-text="userInfo.mobile" />
                        </div>
                        <div>
                            <v-btn flat
                                   icon
                                   color="primary"
                                   @click="signOut">
                                <v-icon>iconfont icon-out</v-icon>
                            </v-btn>
                        </div>
                    </v-toolbar-items>
                </v-toolbar>
            </v-flex>
            <v-flex grow>
                <v-layout row fill-height>
                    <v-layout row fill-height>
                        <v-flex shrink>
                            <v-navigation-drawer class="nav"
                                                 permanent
                                                 :width="185"
                                                 :mini-variant="miniMenu">
                                <my-menu class="menu" :value="menuTree" />
                            </v-navigation-drawer>
                        </v-flex>
                        <v-flex md12
                                d-flex
                                overflow-x-hidden>
                            <v-content class="homeMain">
                                <v-tabs class="tabs">
                                    <v-tab v-for="(item, index) in tabs"
                                           :key="index"
                                           :to="{path: item.url}"
                                           @click="updateMenuActive(item)">
                                        {{ item.title }}
                                        <v-btn class="close"
                                               flat
                                               icon
                                               small
                                               @click.prevent="tabDel(index)">
                                            <v-icon small>
                                                close
                                            </v-icon>
                                        </v-btn>
                                    </v-tab>
                                    <v-tabs-items class="tabsMain">
                                        <keep-alive include="">
                                            <router-view />
                                        </keep-alive>
                                    </v-tabs-items>
                                </v-tabs>
                            </v-content>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {
    mapGetters, mapMutations, mapActions,
} from 'vuex';
import myMenu from '~/menuList';
export default {
    name: 'Home',
    components: { myMenu },
    data() {
        return {
            // 迷你菜单
            miniMenu: false,
        };
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
        ...mapGetters('storeUser', ['userInfo']),
    },
    methods: {
        // 切换菜单
        changeMiniMenu() {
            this.miniMenu = !this.miniMenu;
        },
        ...mapMutations('storeUser', ['signOut']),
        ...mapActions(['tabDel', 'updateMenuActive']),
    },
};
</script>

<style lang="stylus" scoped>
.home > .layout
    background $_color_white
    $topHeight = 50px
    $border = 1px solid $_color_border_home
    .toolbar >>>
        height $topHeight
        background-color $_color_white
        border-bottom $border
        box-sizing content-box
        & > .v-toolbar__content
            padding 0
            height $topHeight!important
        .logoMain
            padding-left 18px
            width 185px
            height 100%
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
            .menuButton
                height 100%
                border 0px solid $_color_border_home
                border-left-width 1px
                border-right-width 1px
                display flex
                align-items center
        .v-toolbar__items
            & > div
                padding 0 10px
                // height 100%
                border-left 1px solid $_color_border
                display flex
                align-items center
        .userInfo
            span
                font-weight 400
            .mobile
                margin-left 15px
                color $_color_primary
    .nav
        // width 185px
        .menu
            padding 0
    .homeMain
        height: 100%
        .tabs
            height: 100%
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
