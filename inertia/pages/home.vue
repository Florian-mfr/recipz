<template>
  <div class="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Gestionnaire de Recettes</h1>
    <div class="space-y-4">
      <Link
        href="/items"
        class="block w-64 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
      >
        Gérer les Items
      </Link>
      <Link
        href="/resources"
        class="block w-64 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
      >
        Gérer les Ressources
      </Link>
      <Link
        href="/crafting-list"
        class="block w-64 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
      >
        Liste de Craft
      </Link>
      <Link
        href="/inventory"
        class="block w-64 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
      >
        Mes ressources
      </Link>
    </div>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
</script>
