<template>
    <v-app>
        <router-view />
        <alert-message v-for="(item, index) in alertMessage"
                       :key="index"
                       :value="true"
                       v-bind="item">
            {{ item.content }}
        </alert-message>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'App',
    computed: { ...mapGetters(['alertMessage']) },
};
</script>
