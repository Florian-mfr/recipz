<template>
  <div class="bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ formType === 'login' ? 'Connexion' : 'Créer un compte' }}</h1>
      <form v-if="formType === 'login'" @submit.prevent="submitLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <InputText v-model="loginForm.email" type="email" id="email" required fluid />
          <div v-if="loginForm.errors.email" class="text-red-600 text-sm mt-1">{{ loginForm.errors.email }}</div>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <Password v-model="loginForm.password" type="password" id="password" :feedback="false" required fluid toggleMask />
          <div v-if="loginForm.errors.password" class="text-red-600 text-sm mt-1">{{ loginForm.errors.password }}</div>
        </div>
        <Button type="submit" class="w-full" :loading="loginForm.processing">Se connecter</Button>
      </form>
      <form v-if="formType === 'register'" @submit.prevent="submitRegister">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <InputText v-model="registerForm.name" type="text" id="name" required fluid />
          <div v-if="registerForm.errors.name" class="text-red-600 text-sm mt-1">{{ registerForm.errors.name }}</div>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <InputText v-model="registerForm.email" type="email" id="email" required fluid />
          <div v-if="registerForm.errors.email" class="text-red-600 text-sm mt-1">{{ registerForm.errors.email }}</div>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <Password v-model="registerForm.password" type="password" id="password" required fluid toggleMask />
          <div v-if="registerForm.errors.password" class="text-red-600 text-sm mt-1">{{ registerForm.errors.password }}</div>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <Password v-model="registerForm.password_confirmation" type="password" id="password" :invalid="registerForm.password_confirmation !== registerForm.password" :feedback="false" required fluid toggleMask />
          <div v-if="registerForm.errors.password" class="text-red-600 text-sm mt-1">{{ registerForm.errors.password }}</div>
        </div>
        <Button type="submit" class="w-full" :loading="registerForm.processing">S'enregistrer</Button>
      </form>
      <div class="mt-6">
        <span class="text-blue-500 hover:text-blue-600 cursor-pointer" @click="toggleFormType">
          {{ formType === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte !' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm, Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import Layout from '../../components/Layout.vue'

const formType = ref('login')

const toggleFormType = () => {
  formType.value = formType.value === 'login' ? 'register' : 'login'
}

const loginForm = useForm({
  email: '',
  password: ''
})

const submitLogin = () => {
  loginForm.post('/login', {
    email: loginForm.email,
    password: loginForm.password
  })
}

const registerForm = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const submitRegister = () => {
  registerForm.post('/register', {
    name: registerForm.name,
    email: registerForm.email,
    password: registerForm.password,
    password_confirmation: registerForm.password_confirmation
  })
}
</script>