<template>
    <h1 class="text-3xl font-bold underline">This is an about page111 {{ res }} {{ isMobile }}</h1>
    <el-button>Click me</el-button>
    <!-- <i-mdi-account-box style="font-size: 2em; color: red"/> -->
    <!-- A basic anchor icon from Phosphor icons -->
    <div class="i-ph-anchor-simple-thin" />
    <!-- An orange alarm from Material Design Icons -->
    <div class="i-mdi-alarm text-orange-400" />
    <!-- A large Vue logo -->
    <div class="i-logos-vue text-3xl" />
    <!-- Sun in light mode, Moon in dark mode, from Carbon -->
    <button class="i-carbon-sun dark:i-carbon-moon" />
    <!-- Twemoji of laugh, turns to tear on hovering -->
    <div class="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" />
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