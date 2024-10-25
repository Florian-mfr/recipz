import { defineConfig } from '@adonisjs/inertia';
const inertiaConfig = defineConfig({
    rootView: 'inertia_layout',
    sharedData: {
        errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    },
    ssr: {
        enabled: false,
        entrypoint: 'inertia/app/ssr.ts'
    }
});
export default inertiaConfig;
//# sourceMappingURL=inertia.js.map