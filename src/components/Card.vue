<template>
  <div :class="cardClass">
    <div :class="imageClass" :style="{ backgroundImage: `url(${image})` }" v-if="image"></div>
    <div v-else :class="[icon, 'w-20 h-20']"></div>
    <div v-if="title || subTitle" :class="titleClass">
      <p class="text-lg text-dark-300 text-bold pb-2 line-clamp-1">{{ title }}</p>
      <p class="text-sm text-dark-100 font-300 line-clamp-2">{{ subTitle }}</p>
    </div>
    <slot :item="{ image, icon, title, subTitle, url }"></slot>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// image: string
// icon: string -> class i-
// title: string
// subTitle: string
// url: string
const props = defineProps({
  image: String,
  imageType: {
    type: String as PropType<'default' | 'rounded' | 'avatar'>,
    default: 'default'
  },
  icon: String,
  title: String,
  subTitle: String,
  url: String,
  border: Boolean
})

const cardClass = computed(() => {
  // ['flex flex-col w-80', { 'items-start p-4': icon }]
  let defaultClass = 'flex flex-col w-80'
  if (props.icon) {
    defaultClass += ' items-start p-4'
  }
  if (props.imageType === 'rounded') {
    defaultClass += ' rounded overflow-hidden'
  } else if (props.imageType === 'avatar') {
    defaultClass += ' relative mt-10'
  }
  if (props.border) {
    defaultClass += ' border border-gray-300'
  }
  return defaultClass
})

const imageClass = computed(() => {
  const defaultClass = 'bg-image '
  if (!props.title && !props.subTitle && props.imageType === 'rounded') {
    return defaultClass + 'h-60 rounded'
  } else if (props.imageType === 'avatar') {
    return defaultClass + 'h-20 w-20 rounded-1/2 self-center absolute top-0 translate-y--1/2'
  }
  return defaultClass + 'h-40'
})

const titleClass = computed(() => {
  const defaultClass = 'flex flex-col items-start p-4 '
  if (props.imageType === 'avatar') {
    return defaultClass + ' pt-15'
  }
  return defaultClass
})
</script>

<style scoped></style>
