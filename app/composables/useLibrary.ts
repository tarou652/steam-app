import type { Library } from '#shared/types/library'

/** Actions が生成した library.json をブラウザで読み込む */
export function useLibrary() {
  const { app } = useRuntimeConfig()
  return useFetch<Library>(`${app.baseURL}data/library.json`, {
    key: 'library',
    server: false,
  })
}
