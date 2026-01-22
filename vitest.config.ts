import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig('test'),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'cypress/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        reporter: ['text', 'json', 'html'],
        enabled: true,
      },
    },
  }),
)
