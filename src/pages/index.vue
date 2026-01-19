<template>
  <div>
    <h1>Home</h1>
    <p>{{ res }}</p>
    <p>{{ isMobile }}</p>
  </div>
</template>
<script setup lang="ts">
const res = ref(1)
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 500)
</script>
