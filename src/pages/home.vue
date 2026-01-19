<template>
    <div>
        home to <router-link to="/about">about</router-link>
        <HelloWorld msg="Hello Vue 3 + TypeScript + Vite">
            <slot name="title" :id="id"> </slot>
        </HelloWorld>
    </div>
</template>
<script setup lang="ts">
defineSlots<{
    title: (props: { id: number }) => VNode
}>()
import { registerSW } from 'virtual:pwa-register'
onMounted(() => {
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      setInterval(() => {
        if (registration) {
          registration.update()
        }
      }, 3600000)
    },
    onRegisterError(error) {
      console.log('Error: ', error)
    },
  })
})
const id = ref(123)
</script>
<route lang="yaml">
    meta:
      layout: default
      bgColor: blue
</route>