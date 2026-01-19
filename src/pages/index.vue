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

import { registerSW } from 'virtual:pwa-register'
onMounted(() => {
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      setInterval(() => {
        if (registration) {
          registration.update()
        }
      }, 10000)
    },
    onRegisterError(error) {
      console.log('Error: ', error)
    },
  })
})
</script>
