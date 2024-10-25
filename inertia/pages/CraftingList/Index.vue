<template>
  <div class="p-4 bg-gray-100 w-[100vw] h-[100vh]">
    <ConfirmDialog />
    <!-- En-tête -->
    <div class="flex items-center gap-2 text-gray-600 mb-2">
      <!-- <img src="../../assets/logo.png" alt="logo" class="w-[140px]"/> -->
      <Link href="/crafting-list" class="hover:text-primary-500">
        <i class="pi pi-home"></i>
        <span class="ml-2">Accueil</span>
      </Link>
    </div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-semibold">Tableau de bord</h1>
      <Button 
        icon="pi pi-plus" 
        label="Nouvelle liste"
        @click="openCreateDialog"
      />
    </div>

    <!-- Section des listes de craft -->
    <div class="grid">
      <div class="col-12 lg:col-8 mb-10">
        <Card >
          <template #title>
            <div class="flex justify-between items-center">
              <span>Mes listes de craft</span>
            </div>
          </template>
          <template #content>
            <div v-if="!craftLists.length">
              <p class="text-gray-500 text-center">Aucune liste de craft pour le moment</p>
            </div>
            <DataTable v-else 
              v-model:selection="selectedProduct"
              :value="craftLists" 
              :rows="5"
              responsiveLayout="scroll"
              class="p-datatable-sm"
              selectionMode="single"
              dataKey="id"
              @rowSelect="onRowSelect"
            >
              <Column field="name" header="Nom">
                <template #body="{ data }">
                  <div 
                    class="text-primary-600"
                  >
                    {{ data.name }}
                </div>
                </template>
              </Column>
              <Column header="Nombre d'items">
                <template #body="{ data }">
                  {{ data.items.length }}
                </template>
              </Column>
              <Column header="Ressources">
                <template #body="{ data }">
                  {{ formatMissingResources(data) }}
                </template>
              </Column>
              <Column field="updated_at" header="Dernière modification">
                <template #body="{ data }">
                  {{ new Date(data.updatedAt).toLocaleDateString() }}
                </template>
              </Column>
              <Column>
                <template #body="{ data }">
                  <div class="flex justify-end">
                    <Button 
                      icon="pi pi-pencil"
                      class="mr-2"
                      @click="openEditDialog(data)"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      severity="danger"
                      @click="confirmDeleteCraftList(data)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Section inventaire -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #title>
            <div class="flex justify-between items-center">
              <span>Mes ressources</span>
            </div>
          </template>
          <template #content>
            <div v-if="!inventoryResources.length">
              <p class="text-gray-500 text-center">Aucune ressource récente</p>
            </div>
            <DataTable v-else
              :value="inventoryResources" 
              :rows="5"
              class="p-datatable-sm"
            >
              <Column field="resource.name" header="Ressource" />
              <Column field="quantity" header="Quantité">
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <InputNumber 
                      :model-value="data.quantity"
                      :min="0"
                      showButtons
                      class="w-32"
                      @update:model-value="(value) => handleInventoryUpdate(data, value)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Dialog création de liste -->
    <CraftingListDialog
      v-model:modelValue="showDialog"
      :craft-list="selectedCraftList"
      redirect-route="/crafting-list"
      :redirect-route-options="{ preserveScroll: true }"
      @close="selectedCraftList = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Link } from '@inertiajs/vue3'
import { useToast } from 'primevue/usetoast'
import { router } from '@inertiajs/vue3'
import { useConfirm } from "primevue/useconfirm";
import { debounce } from 'lodash'
import CraftingListDialog from './Dialog.vue'
import Logo from '../../components/Logo.vue'

const confirm = useConfirm();

// Props reçues du backend via Inertia
const props = defineProps({
  craftLists: {
    type: Array,
    required: true
  },
  inventory: {
    type: Array,
    required: true
  }
})

const inventoryResources = ref(props.inventory)

watch(() => props.inventory, (newValue) => {
  inventoryResources.value = newValue
})


const toast = useToast()
const selectedProduct = ref();
const showDialog = ref(false)

const selectedCraftList = ref(null)

const onRowSelect = (event) => {
  router.get(`/crafting-list/${event.data.id}`)
}

// Format pour l'affichage des ressources manquantes
const formatMissingResources = (list) => {
  if (!list.items || !list.items.length) return '0/0'
  const total = list.items.reduce((acc, item) => acc + item.resources.reduce((acc2, resource) => acc2 + resource.quantityRequired, 0), 0)
  // const total = Object.values(list.required_resources || {}).length
  const available = Object.values(list.available_resources || {}).length
  return `${available}/${total}`
}

const openCreateDialog = () => {
  selectedCraftList.value = null
  showDialog.value = true
}

const openEditDialog = (craftList) => {
  selectedCraftList.value = craftList
  showDialog.value = true
}
// Mise à jour locale immédiate
const updateLocalInventory = (resource, newValue) => {
  inventoryResources.value.find(res => res.id === resource.id).quantity = newValue
}

// Sauvegarde différée vers l'API
const saveInventory = debounce(async (inventoryResource, newValue) => {
  try {
    console.log(`Mise à jour de l'inventaire pour ${inventoryResource.resource.name} vers ${newValue}`)
    await router.post(`/inventory`, {
      resource: inventoryResource.resource,
      quantity: newValue,
      redirectRoute: '/crafting-list'
    })
    
    toast.add({
      severity: 'success',
      summary: 'Inventaire mis à jour',
      detail: `Quantité mise à jour pour ${inventoryResource.resource.name}`,
      life: 3000
    })
  } catch (error) {
    // En cas d'erreur, revenir à l'ancienne valeur
    console.log('Erreur lors de la mise à jour de l\'inventaire', error)
    inventoryResources.value.find(res => res.id === resource.id).quantity = resource.quantity
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Erreur lors de la mise à jour de l\'inventaire',
      life: 3000
    })
  }
}, 500)

// Gestionnaire de mise à jour
const handleInventoryUpdate = (resource, newValue) => {
  updateLocalInventory(resource, newValue)
  saveInventory(resource, newValue)
}

const confirmDeleteCraftList = (craftList) => {
  confirm.require({
    message: `Voulez vous supprimer votre liste de craft "${craftList.name}" ?`,
    header: 'Suppression de liste',
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
      router.delete(`/crafting-list/${craftList.id}`)
    },
    reject: () => {
        console.log('reject')
    }
  });
};
</script>

<style scoped>
:deep(.p-button.p-button-icon-only) {
  width: 2rem;
  height: 2rem;
}
:deep(.p-inputnumber-input) {
  width: 3rem !important;
}

:deep(.p-inputnumber-button) {
  width: 1.5rem;
}
</style>
