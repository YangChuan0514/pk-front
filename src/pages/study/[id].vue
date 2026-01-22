<template>
  <div>id: {{ route.id }}</div>
</template>

<script setup lang="ts">
import { useParams } from '@/hooks'

type Params = {
  id: string
}
// const route = useRoute().params as Params
const route = useParams<Params>()

// const route = useParams<type>()
// route.property
</script>

<style scoped></style>
