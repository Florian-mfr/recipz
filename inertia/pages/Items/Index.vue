<template>
  <Layout backUrl="/">
    <div class="bg-gray-100 min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Liste des Items</h1>
        <div class="flex justify-between items-center mb-4">
          <input
            v-model="filter"
            type="text"
            placeholder="Filtrer par nom"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href="/items/create"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Créer un nouvel item
          </Link>
        </div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nom
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ressources
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ item.name }}</td>
                <td class="px-6 py-4 text-gray-500">
                  <ul>
                    <li v-for="resource in item.resources" :key="resource.id">
                      {{ resource.name }} - Quantité: {{ resource.quantity_required }}
                    </li>
                  </ul>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Link
                    :href="`/items/${item.id}/edit`"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../../components/Layout.vue'
import { ref, computed } from 'vue'
import { Link, useForm } from '@inertiajs/vue3'

const props = defineProps({
  items: Array
})

const filter = ref('')

const filteredItems = computed(() => {
  return props.items.filter(item =>
    item.name.toLowerCase().includes(filter.value.toLowerCase())
  )
})

// const form = useForm()

const deleteItem = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet item ?')) {
    try {
      // Appel à la route de suppression via fetch
      const response = await fetch(`/items/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Actualise la page ou retire l'item du tableau local
        location.reload()
      } else {
        console.error('Failed to delete item.')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }
}
</script>
