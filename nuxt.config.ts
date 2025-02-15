// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxtjs/tailwindcss',
    'radix-vue/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxthub/core',
    '@nuxt/fonts',
    '@nuxt/image',
    'shadcn-nuxt',
  ],

  imports: {
    imports: [
      {
        from: 'tailwind-variants',
        name: 'tv',
      },
      {
        from: 'tailwind-variants',
        name: 'VariantProps',
        type: true,
      },
    ],
  },
  devtools: { enabled: true },

  css: ['../assets/css/tailwind.css'],

  colorMode: {
    classSuffix: '',
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-01-01',

  fonts: {
    families: [
      { name: 'Recursive', provider: 'fontsource' },
      { name: 'Cormorant Garamond', provider: 'google' },
    ],
  },

  tailwindcss: {
    exposeConfig: true,
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  }
});