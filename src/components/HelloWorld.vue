<script setup lang="ts">
defineProps<{
  msg: string
}>()
// const emits = defineEmits<{
  // (e: 'update:msg', value: string): void,
  // title:[id: number]: void
// }>()
</script>

<template>
  <div class="greetings">
   Hello World {{ msg }} 
   <slot name="title"></slot>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
