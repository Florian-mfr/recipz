<template>
  <Layout>
    <div class="bg-gray-100 min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Modifier l'item</h1>
        <form @submit.prevent="submit">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <TextInput v-model="form.name" id="name" required fluid />
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
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
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
import { onMounted } from 'vue'

const props = defineProps({
  item: Object,
  availableResources: Array
})

const form = useForm({
  name: props.item.name,
  resources: props.item.resources.map(r => ({
    id: r.id,
    quantity: r.quantity_required,
    selectedResource: null, // Sera initialisé dans onMounted
    name: r.name
  }))
})

// Initialise les selectedResource lors du montage du composant
onMounted(() => {
  form.resources.forEach(resource => {
    resource.selectedResource = props.availableResources.find(r => r.id === resource.id)
  })
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
    resource.name = resource.selectedResource.name
  }
}

const submit = () => {
  // Transforme les données avant l'envoi
  const formData = {
    name: form.name,
    resources: form.resources.reduce((acc, resource) => {
      if (resource.id) {
        acc[resource.id] = { 
          quantity: resource.quantity,
        }
      }
      return acc
    }, {})
  }

  form.put(`/items/${props.item.id}`, formData)
}
</script>