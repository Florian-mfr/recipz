<template>
  <Layout backUrl="/resources">
    <div class="bg-gray-100 min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Modifier la ressource</h1>
        <form @submit.prevent="submit">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input 
              v-model="form.name" 
              type="text" 
              id="name" 
              required
              class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
          </div>
          <div class="mb-4">
            <label for="price" class="block text-sm font-medium text-gray-700">Prix (optionnel)</label>
            <input 
              v-model="form.price" 
              type="number" 
              step="0.01" 
              id="price"
              class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
          </div>
          <button 
            type="submit" 
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            :disabled="form.processing"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../../components/Layout.vue'
import { useForm } from '@inertiajs/vue3'

const props = defineProps({
  resource: Object
})

const form = useForm({
  name: props.resource.name,
  price: props.resource.price
})

const submit = () => {
  form.put(`/resources/${props.resource.id}`)
}
</script>