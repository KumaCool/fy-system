<template lang="html">
    <v-btn v-bind="$attrs"
           @click="openFind">
        <slot />
        <input ref="fileInput"
               type="file"
               hidden="hidden"
               @change="change">
    </v-btn>
</template>

<script>
export default {
    name: 'Upload',
    methods: {
        // 打开文件选择器
        openFind() {
            this.$refs.fileInput.click();
        },
        change(e) {
            let files = e.target.files;
            this.$emit('change', files);
        },
    },
};
</script>
