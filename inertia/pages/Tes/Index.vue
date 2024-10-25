<template>
  <div class="p-4 bg-gray-100 w-[100vw] h-[100vh]">
    <ConfirmDialog></ConfirmDialog>
    <!-- En-tête -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-semibold">Tableau de bord</h1>
      <Button 
        icon="pi pi-plus" 
        label="Nouvelle liste" 
        severity="success"
        @click="showCreateListDialog = true"
      />
    </div>

    <!-- Section des listes de craft -->
    <div class="grid">
      <div class="col-12 lg:col-8 mb-10">
        <Card >
          <template #title>
            <div class="flex justify-between items-center">
              <span>Mes listes de craft</span>
              <Link 
                href="/craft-lists" 
                class="text-sm text-primary-500 hover:underline"
              >
                Voir tout
              </Link>
            </div>
          </template>
          <template #content>
            <div v-if="!craftLists.length">
              <p class="text-gray-500 text-center">Aucune liste de craft pour le moment</p>
            </div>
            <DataTable v-else 
              :value="craftLists" 
              :rows="5" 
              responsiveLayout="scroll"
              class="p-datatable-sm"
            >
              <Column field="name" header="Nom">
                <template #body="{ data }">
                  <Link 
                    :href="`/craft-lists/${data.id}`"
                    class="text-primary-600 hover:underline"
                  >
                    {{ data.name }}
                  </Link>
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
                      class="mr-2 p-button-outlined p-button-primary" 
                      @click="openUpdateList(data)" 
                    />
                    <Button 
                      icon="pi pi-trash" 
                      class="p-button-danger" 
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
              <span>Aperçu de l'inventaire</span>
              <Link 
                href="/inventory" 
                class="text-sm text-primary-500 hover:underline"
              >
                Gérer
              </Link>
            </div>
          </template>
          <template #content>
            <div v-if="!recentResources.length">
              <p class="text-gray-500 text-center">Aucune ressource récente</p>
            </div>
            <DataTable v-else
              :value="recentResources" 
              :rows="5"
              class="p-datatable-sm"
            >
              <Column field="name" header="Ressource" />
              <Column field="quantity" header="Quantité" />
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Dialog création de liste -->
    <Dialog 
      v-model:visible="showCreateListDialog" 
      modal 
      :header="listForm.id ? 'Modifier liste de craft' : 'Nouvelle liste de craft'"
      :style="{ width: '500px' }"
    >
      <div class="flex flex-col gap-4">
        <div class="field">
          <label for="name" class="font-bold">Nom</label>
          <InputText 
            id="name" 
            v-model="listForm.name" 
            class="w-full"
            autofocus 
          />
        </div>

        <div class="field">
          <label class="font-bold">Ajouter un item</label>
          <div class="flex gap-2">
            <AutoComplete
              v-model="selectedItem"
              :suggestions="suggestions"
              :delay="300"
              class="w-full"
              optionLabel="name"
              placeholder="Rechercher un item..."
              @complete="searchItems"
              @item-select="addItem"
              :pt="{
                item: { class: 'custom-item' }
              }"
            >
              <template #item="{ item }">
                <div class="flex items-center gap-2">
                  <span>{{ item.name }}</span>
                  <span class="text-sm text-gray-500">({{ item.type }})</span>
                </div>
              </template>
            </AutoComplete>
          </div>
        </div>

        <!-- Liste des items ajoutés -->
        <div v-if="listForm.items.length > 0" class="border rounded-lg px-3">
          <div v-for="item in listForm.items" :key="item.id" 
              class="flex items-center justify-between py-2 border-b last:border-b-0">
            <div class="flex flex-col">
              <span class="font-medium">{{ item.name }}</span>
              <span class="text-sm text-gray-500">{{ item.type }}</span>
            </div>
            <div class="flex items-center gap-2">
              <InputNumber 
                v-model="item.quantity" 
                :min="1"
                showButtons
                :step="1"
                class="w-20"
              />
              <Button 
                icon="pi pi-trash" 
                severity="danger" 
                text 
                @click="removeItem(item.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button 
          label="Annuler" 
          icon="pi pi-times" 
          text 
          @click="showCreateListDialog = false" 
        />
        <Button 
          :label="listForm.id ? 'Modifier' : 'Créer'" 
          icon="pi pi-check" 
          @click="listForm.id ? updateList() : createNewList()" 
          :loading="$inertia.processing"
          :disabled="!canCreate"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import { useToast } from 'primevue/usetoast'
import { router } from '@inertiajs/vue3'
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();

// Props reçues du backend via Inertia
const props = defineProps({
  craftLists: {
    type: Array,
    required: true
  },
  recentResources: {
    type: Array,
    required: true
  }
})

console.log(props.craftLists)

const toast = useToast()
const showCreateListDialog = ref(false)
const listForm = ref({
  id: null,
  name: '',
  items: [] // Array d'objets {id, name, type, quantity}
})

const selectedItem = ref(null)
const suggestions = ref([])

const canCreate = computed(() => {
  return listForm.value.name.trim() !== '' && listForm.value.items.length > 0
})

// Recherche d'items
const searchItems = async (event) => {
  if (event.query.trim().length < 2) {
    suggestions.value = []
    return
  }

  try {
    const response = await fetch(`/items/search?q=${event.query}`)
    const data = await response.json()
    suggestions.value = data
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Erreur lors de la recherche des items',
      life: 3000
    })
  }
}

// Ajout d'un item à la liste
const addItem = (event) => {
  const selectedItemInput = event.value
  
  // Vérifier si l'item n'est pas déjà dans la liste
  const exists = listForm.value.items.some(item => item.id === selectedItemInput.id)
  if (!exists) {
    listForm.value.items.push({
      id: selectedItemInput.id,
      name: selectedItemInput.name,
      type: selectedItemInput.type,
      quantity: 1
    })
  } else {
    toast.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Cet item est déjà dans la liste',
      life: 2000
    })
  }

  // Reset la sélection
  selectedItem.value = null
}

// Supprimer un item de la liste
const removeItem = (itemId) => {
  listForm.value.items = listForm.value.items.filter(item => item.id !== itemId)
}

// Dialog pour création de nouvelle liste
const createNewList = () => {
  router.post('/crafting-list', {
    name: listForm.value.name,
    items: listForm.value.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }))
  }, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Liste créée',
        detail: 'Votre nouvelle liste a été créée avec succès',
        life: 3000
      })
      showCreateListDialog.value = false
      listForm.value = { name: '', items: [] }
    },
    onError: (errors) => {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la création',
        life: 3000
      })
    }
  })
}

const updateList = () => {
  router.put(`/crafting-list/${listForm.value.id}`, {
    name: listForm.value.name,
    items: listForm.value.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }))
  }, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Liste modifiée',
        detail: 'Votre liste a été modifiée avec succès',
        life: 3000
      })
      showCreateListDialog.value = false
      listForm.value = { name: '', items: [] }
    },
    onError: (errors) => {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la modification',
        life: 3000
      })
    }
  })
}

// Format pour l'affichage des ressources manquantes
const formatMissingResources = (list) => {
  // let total = 0
  // list.items.forEach(item => {
  //   item.resources.forEach(resource => {
  //     console.log('resource', resource.quantityRequired)
  //     total += resource.quantityRequired
  //   })
  // })
  if (!list.items || !list.items.length) return '0/0'
  const total = list.items.reduce((acc, item) => acc + item.resources.reduce((acc2, resource) => acc2 + resource.quantityRequired, 0), 0)
  // const total = Object.values(list.required_resources || {}).length
  const available = Object.values(list.available_resources || {}).length
  return `${available}/${total}`
}

const openUpdateList = (craftList) => {
  listForm.value = {
    id: craftList.id,
    name: craftList.name,
    items: craftList.items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      quantity: item.quantity
    }))
  }
  showCreateListDialog.value = true
}

const confirmDeleteCraftList = (craftList) => {
  console.log(craftList)
  confirm.require({
    message: `Voulez vous supprimer votre liste de crafts "${craftList.name}" ?`,
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
      router.delete(`/crafting-list/${craftList.id}`)
    },
    reject: () => {
        console.log('reject')
    }
  });
};
</script>

<style scoped>
:deep(.p-inputnumber) {
  width: 4rem;
}

:deep(.p-inputnumber-input) {
  width: 2rem !important;
  padding-right: 18px !important;
  text-align: center;
}

:deep(.p-inputnumber-button) {
  width: 1.3rem;
}

:deep(.p-button.p-button-icon-only) {
  width: 2rem;
  height: 2rem;
}
</style>
