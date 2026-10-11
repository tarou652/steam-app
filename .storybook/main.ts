import type { StorybookConfig } from '@nuxtjs/storybook'

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(js|ts)'],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
}

export default config
