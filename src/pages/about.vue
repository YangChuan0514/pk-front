<template>
    <h1 class="text-3xl font-bold underline">This is an about page111 {{ res }} {{ isMobile }}</h1>
</template>
<script setup lang="ts">
const res = ref(1)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 500)
</script>
<style scoped lang="scss"></style>
<route lang="yaml">
    meta:
      layout: header
      bgColor: yellow
    </route>