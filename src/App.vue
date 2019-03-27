<template>
    <v-app>
        <router-view />
        <alert-message v-for="(item, index) in alertMessage"
                       :key="index"
                       :value="true"
                       v-bind="item">
            {{ item.content }}
        </alert-message>
        <v-tooltip v-model="tooltip.show"
                   v-bind="tooltip.attrs"
                   :activator="tooltip.activator"
                   :position-x="tooltip.x"
                   :position-y="tooltip.y">
            <span>{{ tooltip.content }}</span>
        </v-tooltip>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'App',
    computed: { ...mapGetters(['alertMessage', 'tooltip']) },
};
</script>
