<template>
  <Layout>
    <div class="bg-gray-900 shadow overflow-hidden sm:rounded-lg">
      <div class="flex justify-between items-center">
        <div class="px-4 py-5 sm:px-6">
          <h1 class="text-2xl font-bold text-gray-200">Mon inventaire de ressources</h1>
        </div>
        <Button icon="pi pi-plus-circle" label="Ajouter une ressource" @click="isModalOpen = true" class="mr-6 text-gray-200" />
      </div>
      <div class="px-4 py-5 sm:p-6">
        <ConfirmDialog></ConfirmDialog>
        <div v-if="!inventory.length">
          <p>Vous n'avez pas encore de ressources dans votre inventaire.</p>
        </div>
        <div v-else>
          <DataTable v-model:filters="filters" :value="inventory" :globalFilterFields="['resource.name']">
            <div class="flex justify-end mb-2">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Rechercher" />
              </IconField>
            </div>
            <Column field="resource.name" header="Ressource"></Column>
            <Column field="quantity" header="Quantité"></Column>
            <Column>
              <template #body="{ data }">
                <div class="flex justify-end">
                  <Button 
                    icon="pi pi-pencil" 
                    class="mr-2 p-button-outlined p-button-primary" 
                    @click="updateInventory(data.resource)" 
                  />
                  <Button 
                    icon="pi pi-trash" 
                    class="p-button-danger" 
                    @click="confirmDelete(data.resource)" 
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </Layout>
  <div v-if="isModalOpen">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div class="relative bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <button @click="closeModal" class="absolute top-0 right-0 p-4">
          <svg class="h-6 w-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-200 mb-6">{{ isFormResourceAlreadyInInventory(form.resource) ? 'Modifier une ressource' : 'Ajouter une ressource' }}</h1>
        <form @submit.prevent="submit">
          <div class="mb-4">
            <div class="flex flex-between gap-2">
              <div class="w-3/4">
                <label for="resourceId" class="block text
                -sm font-medium text-gray-200">Ressource</label>
                <Select v-model="form.resource" :options="availableResources" optionLabel="name" placeholder="Ajouter une ressource" class="text-gray-200 w-full" filter />
              </div>
              <div class="w-1/4">
                <label for="resourceId" class="block text
                -sm font-medium text-gray-200">Quantité</label>
                <InputNumber v-model="form.quantity" inputId="minmax-buttons" mode="decimal" showButtons :min="1" :max="99999" fluid class="text-gray-200" />
              </div>
            </div>
          </div>
          <Button label="Valider" class="w-full" @click="addRessourceToInventory()" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Layout from '../../components/Layout.vue'
import { useForm, Link } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();

const isModalOpen = ref(false)

const filterSeach = ref('')

const isFormResourceAlreadyInInventory = (resource) => {
  return props.inventory.findIndex(i => i.resource.id === resource?.id) !== -1
}

const props = defineProps({
  inventory: Array,
  availableResources: Array
})

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const form = useForm({
  resource: null,
  quantity: 1
})

const closeModal = () => {
  isModalOpen.value = false
  form.resource = null
  form.quantity = 1
}

const addRessourceToInventory = () => {
  if (!form.resource || !form.quantity) return
  form.post('/inventory/add', {
    ressource: form.resource,
    quantity: form.quantity
  })
  isModalOpen.value = false
}

const updateInventory = (resource) => {
  form.resource = resource
  form.quantity = props.inventory.find(i => i.resource.id === resource.id)?.quantity || 1
  isModalOpen.value = true
}

const confirmDelete = (resource) => {
    confirm.require({
        message: `Voulez vous supprimer ${resource.name} de votre inventaire?`,
        header: 'Suppression de ressource',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Annuler',
        rejectProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Supprimer',
            severity: 'danger'
        },
        accept: () => {
          form.delete(`/inventory/${resource.id}`)
        },
        reject: () => {
            console.log('reject')
        }
    });
};
</script>