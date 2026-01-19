import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Layouts from 'vite-plugin-vue-layouts';
// import VueMacros from 'vue-macros'
import { VitePWA } from 'vite-plugin-pwa'
import { viteMockServe } from 'vite-plugin-mock'
import { manifest } from './pwa/manifest'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // vue3.3之后就不需要VueMacros了
    // VueMacros.vite(
    //   {
    //     plugins: {
    //       vue: vue(),
    //     },
    //   }
    // ),
    vue(),
    pages(),
    UnoCSS({}),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        // presets
        'vue',
        'vue-router',
        '@vueuse/core'
      ],
    }),
    Components({
      dts: true,
      resolvers: [ElementPlusResolver(), IconsResolver({
        prefix: 'i',
      })],
    }),
    Icons({
      autoInstall: true,
    }),
    Layouts({
      layoutsDirs: 'src/layout',
      defaultLayout: 'default',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest,
    }),
    viteMockServe({
      // default
      mockPath: 'mock',
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
