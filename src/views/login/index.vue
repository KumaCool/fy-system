<template lang="html">
    <v-container layout
                 align-center
                 justify-center>
        <v-layout class="main"
                  row
                  wrap>
            <v-flex shrink>
                <div class="banner" />
            </v-flex>
            <v-flex class="com">
                <h1>
                    <span class="zTitle" v-text="title" />
                    <span>客户管理系统</span>
                    <router-link v-show="!isSignIn"
                                 class="back"
                                 :to="{name: 'signIn'}">
                        <v-icon>
                            arrow_back
                        </v-icon>
                    </router-link>
                </h1>
                <router-view />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Login',
    computed: {
        // 是否登陆页
        isSignIn() {
            return this.$route.name === 'signIn';
        },
        title() {
            return this.isSignIn ? '登陆' : '修改密码';
        },
    },
};

</script>

<style lang="stylus" scoped>
.main
    max-width 938px
    radius()
    overflow hidden
.banner
    width 376px
    height 426px
    background url($_img +'/login/banner.png') no-repeat center
    background-size cover
.com
    padding 0 40px
    background $_color_white
h1
    display flex
    align-items baseline
    fs()
        font-size 48px
    .zTitle
        color $_color_primary
        fs()
    .back
        flex auto
        text-align right
        i
            color $_color_primary
            fs()
</style>
