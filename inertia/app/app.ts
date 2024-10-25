/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Menubar from 'primevue/menubar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import ConfirmDialog from 'primevue/confirmdialog'
import AutoComplete from 'primevue/autocomplete'
import Card from 'primevue/card'
import Chip from 'primevue/chip'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import ProgressBar from 'primevue/progressbar'
import Panel from 'primevue/panel'
import Password from 'primevue/password'

import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import 'primeicons/primeicons.css'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) })

    app.use(plugin)
    app.use(PrimeVue, {
      // Default theme configuration
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          cssLayer: false,
          darkModeSelector: '.never',
        },
      },
    }) // Ajout de PrimeVue à l'application

    app.use(ConfirmationService)
    app.use(ToastService)

    app.component('Button', Button)
    app.component('InputNumber', InputNumber)
    app.component('Select', Select)
    app.component('Menubar', Menubar)
    app.component('DataTable', DataTable)
    app.component('Column', Column)
    app.component('IconField', IconField)
    app.component('InputIcon', InputIcon)
    app.component('InputText', InputText)
    app.component('ConfirmDialog', ConfirmDialog)
    app.component('AutoComplete', AutoComplete)
    app.component('Card', Card)
    app.component('Chip', Chip)
    app.component('Toast', Toast)
    app.component('Dialog', Dialog)
    app.component('ProgressBar', ProgressBar)
    app.component('Panel', Panel)
    app.component('Password', Password)
    app.mount(el)
  },
})
