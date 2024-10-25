<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <Toast />
    <ConfirmDialog />
    <!-- En-tête avec navigation -->
    <div class="mb-6">
      <div class="flex items-center gap-2 text-gray-600 mb-2">
        <Link href="/crafting-list" class="hover:text-primary-500">
          <i class="pi pi-home"></i>
          <span class="ml-2">Accueil</span>
        </Link>
        <i class="pi pi-angle-right text-sm"></i>
        <span>{{ craftList.name }}</span>
      </div>
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-semibold">{{ craftList.name }}</h1>
        <div class="flex gap-2">
          <Button 
            icon="pi pi-pencil" 
            label="Modifier"
            @click="openEditDialog"
          />
          <Button 
            icon="pi pi-trash" 
            label="Supprimer"
            class="p-button-danger"
            @click="confirmDeleteCraftList()"
            text
          />
        </div>
      </div>
    </div>
    <!-- Liste des items -->
    <div class="grid gap-4 mb-6">
      <Panel :toggleable="true" :expanded="true">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <span>Items à crafter ({{ craftList.items.length }})</span>
          </div>
        </template>
        <DataTable :value="craftList.items" class="p-datatable-sm" stripedRows>
          <Column field="name" header="Item" />
          <Column field="type" header="Type" />
          <Column header="Quantité" field="quantity" />
        </DataTable>
      </Panel>
    </div>

    <!-- Tableau des ressources -->
    <Panel :toggleable="true" :expanded="true">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <span>Ressources nécessaires</span>
          <div class="flex items-center gap-2">
            <span class="text-sm">
              Progression: {{ formatProgress }}
            </span>
            <div class="relative">
              <ProgressBar 
                :value="progressPercentage" 
                class="w-36"
                :showValue="false"
              />
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {{ Math.round(progressPercentage) }}%
              </div>
            </div>
          </div>
        </div>
      </template>
      <DataTable 
        :value="resourcesList" 
        class="p-datatable-sm" 
        stripedRows
        sortField="name"
        :sortOrder="1"
      >
        <Column field="name" header="Ressource" sortable>
          <template #body="{ data }">
            <div class="flex flex-col">
              <span>{{ data.name }}</span>
              <span class="text-xs text-gray-500">{{ data.type }}</span>
            </div>
          </template>
        </Column>
        <Column field="totalRequired" header="Quantité nécessaire" sortable />
        <Column field="inInventory" header="En inventaire" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <InputNumber 
                :model-value="inventoryQuantities.get(data.id) || 0"
                :min="0"
                showButtons
                class="w-32"
                @update:model-value="(value) => handleInventoryUpdate(data, value)"
                :class="{
                  'p-invalid': (inventoryQuantities.get(data.id) || 0) < data.totalRequired
                }"
              />
              <i 
                :class="{
                  'pi pi-check text-green-500': (inventoryQuantities.get(data.id) || 0) >= data.totalRequired,
                  'pi pi-times text-red-500': (inventoryQuantities.get(data.id) || 0) < data.totalRequired
                }"
              ></i>
            </div>
          </template>
        </Column>
        <Column header="Progression" class="w-36">
          <template #body="{ data }">
            <div class="relative">
              <ProgressBar 
                :value="calculateProgress(data)"
                :showValue="false"
              />
              <div class="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {{ Math.round(calculateProgress(data)) }}%
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
    </Panel>

    <CraftingListDialog
      v-model:modelValue="showDialog"
      :craft-list="craftList"
      :redirect-route="`/crafting-list/:id`"
      :redirect-route-options="{
        params: { id: craftList.id },
        preserveScroll: true
      }"
      @close="showDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { router, Link } from '@inertiajs/vue3'
import { useToast } from 'primevue/usetoast'
import { debounce } from 'lodash'
import { useConfirm } from "primevue/useconfirm";
import CraftingListDialog from './Dialog.vue'

const confirm = useConfirm();

const toast = useToast()
const props = defineProps({
  craftList: {
    type: Object,
    required: true
  },
  inventory: {
    type: Array,
    required: true
  }
})

const showDialog = ref(false)

// État local pour les quantités d'inventaire
const inventoryQuantities = ref(new Map())

// État local pour les ressources agrégées
const resourcesList = ref([])

watch(() => props.craftList, () => {
  initializeData()
}, { deep: true })

const openEditDialog = () => {
  showDialog.value = false
  nextTick(() => {
    showDialog.value = true
  })
}

const confirmDeleteCraftList = () => {
  confirm.require({
    message: `Voulez vous supprimer votre liste de craft "${props.craftList.name}" ?`,
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
      router.delete(`/crafting-list/${props.craftList.id}`)
    },
    reject: () => {
        console.log('reject')
    }
  });
};
// Initialise les ressources et l'inventaire
const initializeData = () => {
  const resourceMap = new Map()
  
  // Initialiser les quantités d'inventaire et calculer les totaux
  props.craftList.items.forEach(item => {
    item.resources.forEach(resource => {
      const currentQuantity = props.inventory.find(
        inv => inv.resourceId === resource.id
      )?.quantity || 0
      
      inventoryQuantities.value.set(resource.id, currentQuantity)
      
      const totalRequired = resource.quantityRequired * item.quantity
      if (resourceMap.has(resource.id)) {
        const existing = resourceMap.get(resource.id)
        existing.totalRequired += totalRequired
      } else {
        resourceMap.set(resource.id, {
          id: resource.id,
          name: resource.name,
          type: resource.type,
          totalRequired: totalRequired,
          isCraftable: resource.isCraftable
        })
      }
    })
  })

  // Convertir la Map en tableau
  resourcesList.value = Array.from(resourceMap.values())
}

// Mise à jour locale immédiate
const updateLocalInventory = (resource, newValue) => {
  inventoryQuantities.value.set(resource.id, newValue)
}

// Sauvegarde différée vers l'API
const saveInventory = debounce(async (resource, newValue) => {
  try {
    console.log(`Mise à jour de l'inventaire pour ${resource.name} vers ${newValue}`)
    await router.post(`/inventory`, {
      resource: resource,
      quantity: newValue,
      redirectRoute: `/crafting-list/:id`,
      redirectRouteOptions: {
        params: { id: props.craftList.id },
      }
    },
    {
      preserveScroll: true
    })
    
    toast.add({
      severity: 'success',
      summary: 'Inventaire mis à jour',
      detail: `Quantité mise à jour pour ${resource.name}`,
      life: 3000
    })
  } catch (error) {
    // En cas d'erreur, revenir à l'ancienne valeur
    console.log('Erreur lors de la mise à jour de l\'inventaire', error)
    inventoryQuantities.value.set(resource.id, resource.inInventory)
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

// Calculs des statistiques
const calculateProgress = (resource) => {
  if (!resource) return 0
  const inInventory = inventoryQuantities.value.get(resource.id) || 0
  return Math.round(Math.min(100, (inInventory / resource.totalRequired) * 100))
}

const progressPercentage = computed(() => {
  if (!resourcesList.value.length) return 0
  
  const total = resourcesList.value.reduce((sum, resource) => {
    return sum + calculateProgress(resource)
  }, 0)
  
  return Math.round(total / resourcesList.value.length)
})

const formatProgress = computed(() => {
  const complete = resourcesList.value.filter(
    resource => (inventoryQuantities.value.get(resource.id) || 0) >= resource.totalRequired
  ).length
  return `${complete}/${resourcesList.value.length}`
})

// Initialisation au montage du composant
onMounted(() => {
  initializeData()
})
</script>

<style scoped>
:deep(.p-progressbar) {
  height: 1rem;
}

:deep(.p-datatable) .p-column-header-content {
  justify-content: flex-start;
}

:deep(.p-inputnumber-input) {
  width: 3rem !important;
}

:deep(.p-inputnumber-button) {
  width: 1.5rem;
}

:deep(.p-progressbar) {
  height: 1.5rem; /* ou la hauteur que vous souhaitez */
  position: relative;
}

/* Optional: Ajuster la couleur du texte selon le fond */
.absolute {
  color: var(--surface-900);
  font-weight: semibold;
  font-size: 14px;
}
</style>