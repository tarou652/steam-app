// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  // GitHub Pages で配信するため SPA として静的生成する
  ssr: false,
  modules: ['@pinia/nuxt', '@nuxtjs/storybook'],
  devtools: { enabled: true },
  app: {
    // Actions でリポジトリ名から設定する（例: /steam-app/）
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    head: {
      title: 'Steam Tier Maker',
      htmlAttrs: { lang: 'ja' },
    },
  },
  runtimeConfig: {
    public: {
      // "owner/repo"。画面から Actions を起動するときに使う
      githubRepository: process.env.NUXT_PUBLIC_GITHUB_REPOSITORY ?? '',
    },
  },
  storybook: {
    // nuxt dev と同時に Storybook を起動しない（npm run storybook で個別に起動する）
    enabled: false,
  },
})
