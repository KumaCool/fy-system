<script>
import Vue from 'vue';
import { createHOC } from 'vue-hoc';
import { VTextField, VBtn } from 'vuetify/lib';
Vue.component('v-btn', VBtn);
export default createHOC(VTextField, {
    methods: {
        select() {
            this.$emit('select');
        },
    },
}, {
    slots: {
        append(slots) {
            if (!slots.append) {
                slots.append = [<v-btn color="warning" small onClick={this.select}>搜索</v-btn>];
            }
        },
    },
    listeners: {
        keyup(e) {
            if (e.keyCode === 13) this.select();
        },
    },
});
</script>

<style lang="css" scoped>
</style>
