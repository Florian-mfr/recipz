<template>
  <Layout backUrl="/items">
    <div class="bg-gray-100 min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Créer un nouvel item</h1>
        <form @submit.prevent="submit">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <InputText type="text" v-model="form.name" class="w-full" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Ressources</label>
            <div v-for="(resource, index) in form.resources" :key="index" class="flex items-center mt-2">
              <div class="flex-grow mr-2">
                <Select 
                  v-model="resource.selectedResource" 
                  :options="availableResources" 
                  optionLabel="name" 
                  placeholder="Ajouter une ressource" 
                  class="w-full"
                  filter
                  @change="updateResourceId(index)"
                />
              </div>
              <div class="w-32">
                <InputNumber 
                  v-model="resource.quantity" 
                  mode="decimal" 
                  showButtons 
                  :min="1" 
                  :max="99999" 
                  fluid
                />
              </div>
              <button @click.prevent="removeResource(index)" class="ml-2 text-red-600 hover:text-red-800">
                <i class="pi pi-times"></i>
              </button>
            </div>
            <button @click.prevent="addResource" class="mt-2 text-indigo-600 hover:text-indigo-800">
              + Ajouter une ressource
            </button>
          </div>
          <button 
            type="submit" 
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            :disabled="form.processing"
          >
            Créer
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
  availableResources: Array
})

const form = useForm({
  name: '',
  resources: []
})

const addResource = () => {
  form.resources.push({ 
    selectedResource: null,
    id: null,
    quantity: 1 
  })
}

const removeResource = (index) => {
  form.resources.splice(index, 1)
}

const updateResourceId = (index) => {
  const resource = form.resources[index]
  if (resource.selectedResource) {
    resource.id = resource.selectedResource.id
  }
}

const submit = () => {
  // Transformer les ressources en un objet avec les quantités
  const transformedResources = form.resources.reduce((acc, resource) => {
    if (resource.id) {
      acc[resource.id] = { quantity: resource.quantity }
    }
    return acc
  }, {})

  form.post('/items', {
    data: {
      name: form.name,
      type: 'Ceinture',
      resources: transformedResources
    }
  })
}
</script>