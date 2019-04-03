<template lang="html">
    <v-snackbar class="alertMessage"
                v-bind="attrs"
                v-on="$listeners">
        <slot />
        <v-btn v-if="close"
               icon
               :color="attrs.color || 'info'"
               @click="close">
            <v-icon>close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    name: 'AlertMessage',
    computed: {
        // 原组件的$attrs
        attrs() {
            let attrs = R.dissocPath(['content', 'close'], this.$attrs);
            return attrs;
        },
        // 关闭按钮与事件
        close() {
            return this.$attrs.close || false;
        },
    },
};
</script>

<style lang="stylus" scoped>
</style>
