import presetWind3 from '@unocss/preset-wind3'
import { defineConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      prefix: 'i',
    }),
  ],
})