<template>
  <div class="min-h-screen bg-gray-600">
    <Menubar :model="items" />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { Link, router } from '@inertiajs/vue3'
import { computed, ref } from 'vue'

const items = ref([
  { label: 'Home', icon: 'pi pi-home', url: '/' },
  { label: 'Items', icon: 'pi pi-list', url: '/items' },
  { label: 'Ressources', icon: 'pi pi-list', url: '/resources' },
  { label: 'Mes Crafts', icon: 'pi pi-hammer', url: '/crafting-list' },
  { label: 'Mes Ressources', icon: 'pi pi-shopping-bag', url: '/inventory' }
])

const props = defineProps({
  backUrl: {
    type: String,
    default: ''
  }
})

const showBackButton = computed(() => {
  return props.backUrl !== ''
})

const goBack = () => {
  if (props.backUrl) {
    router.visit(props.backUrl)
  } else {
    router.back()
  }
}
</script>