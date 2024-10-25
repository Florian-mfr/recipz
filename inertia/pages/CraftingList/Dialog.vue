<template>
  <Dialog 
    v-model:visible="isVisible"
    modal 
    :header="listForm.id ? 'Modifier liste de craft' : 'Nouvelle liste de craft'"
    :style="{ width: '500px' }"
    @update:visible="(value) => emit('update:modelValue', value)"
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
              fluid
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
        @click="closeDialog"
      />
      <Button 
        :label="listForm.id ? 'Modifier' : 'Créer'" 
        icon="pi pi-check" 
        @click="saveCraftList"
        :loading="$inertia.processing"
        :disabled="!canCreate"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { router } from '@inertiajs/vue3'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  craftList: {
    type: Object,
    default: null
  },
  redirectRoute: {
    type: String,
    default: null
  },
  redirectRouteOptions: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const toast = useToast()
const selectedItem = ref(null)
const suggestions = ref([])

const listForm = ref({
  id: null,
  name: '',
  items: []
})

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Un seul watch sur modelValue qui gère l'initialisation et le reset
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.craftList) {
    // Initialisation du formulaire avec les données de craftList quand la modale s'ouvre
    listForm.value = {
      id: props.craftList.id,
      name: props.craftList.name,
      items: props.craftList.items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity
      }))
    }
  } else {
    // Reset du formulaire quand la modale se ferme
    listForm.value = {
      id: null,
      name: '',
      items: []
    }
    selectedItem.value = null // Reset aussi l'item sélectionné
  }
}, { immediate: true, deep: true })

const canCreate = computed(() => {
  return listForm.value.name.trim() !== '' && listForm.value.items.length > 0
})

const closeDialog = () => {
  isVisible.value = false
  emit('close')
}

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

const addItem = (event) => {
  const selectedItemInput = event.value
  
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

  selectedItem.value = null
}

const removeItem = (itemId) => {
  listForm.value.items = listForm.value.items.filter(item => item.id !== itemId)
}

const saveCraftList = () => {
  const isEdit = listForm.value.id !== null
  const route = isEdit ? `/crafting-list/${listForm.value.id}` : '/crafting-list'
  const method = isEdit ? 'put' : 'post'

  router[method](route, {
    name: listForm.value.name,
    items: listForm.value.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    })),
    redirectRoute: props.redirectRoute,
    redirectRouteOptions: props.redirectRouteOptions
  }, {
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: isEdit ? 'Liste modifiée' : 'Liste créée',
        detail: isEdit ? 'Votre liste a été modifiée avec succès' : 'Votre nouvelle liste a été créée avec succès',
        life: 3000
      })
      closeDialog()
    },
    onError: (errors) => {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue',
        life: 3000
      })
    }
  })
}
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