/**
 * Steam Web API から所持ゲームとウィッシュリストを取得し、public/data/library.json を生成する。
 *
 *   npm run fetch           # STEAM_API_KEY / STEAM_ID が必要（.env でも可）
 *   npm run fetch -- --mock # API を使わずモックデータをコピーする
 */
import { existsSync } from 'node:fs'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Library } from '../shared/types/library'
import {
  mergeLibrary,
  type OwnedGameInput,
  type WishlistItemInput,
} from '../shared/utils/merge-library'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outFile = resolve(root, 'public/data/library.json')
const API = 'https://api.steampowered.com'

async function getJson<T>(url: URL): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    // キーを含む URL はログに出さない
    throw new Error(`${url.pathname} failed: ${res.status} ${res.statusText}`)
  }
  return (await res.json()) as T
}

async function fetchOwnedGames(key: string, steamId: string): Promise<OwnedGameInput[]> {
  const url = new URL(`${API}/IPlayerService/GetOwnedGames/v1/`)
  url.searchParams.set('key', key)
  url.searchParams.set('steamid', steamId)
  url.searchParams.set('include_appinfo', '1')
  url.searchParams.set('include_played_free_games', '1')
  const data = await getJson<{ response: { games?: OwnedGameInput[] } }>(url)
  return data.response.games ?? []
}

async function fetchWishlist(steamId: string): Promise<WishlistItemInput[]> {
  const url = new URL(`${API}/IWishlistService/GetWishlist/v1/`)
  url.searchParams.set('steamid', steamId)
  const data = await getJson<{ response: { items?: WishlistItemInput[] } }>(url)
  return data.response.items ?? []
}

/** ウィッシュリストは appid しか返さないので、ストア API でゲーム名を引く */
async function fetchAppNames(key: string, appids: number[]): Promise<Map<number, string>> {
  const names = new Map<number, string>()
  const chunkSize = 100
  for (let i = 0; i < appids.length; i += chunkSize) {
    const ids = appids.slice(i, i + chunkSize)
    const url = new URL(`${API}/IStoreBrowseService/GetItems/v1/`)
    url.searchParams.set('key', key)
    url.searchParams.set(
      'input_json',
      JSON.stringify({
        ids: ids.map(appid => ({ appid })),
        context: { language: 'japanese', country_code: 'JP' },
        data_request: {},
      }),
    )
    const data = await getJson<{
      response: { store_items?: { appid?: number, id?: number, name?: string }[] }
    }>(url)
    for (const item of data.response.store_items ?? []) {
      const appid = item.appid ?? item.id
      if (appid && item.name) names.set(appid, item.name)
    }
  }
  return names
}

async function main() {
  await mkdir(dirname(outFile), { recursive: true })

  if (process.argv.includes('--mock')) {
    await copyFile(resolve(root, 'mocks/library.json'), outFile)
    console.log(`Copied mock data to ${outFile}`)
    return
  }

  const envFile = resolve(root, '.env')
  if (existsSync(envFile)) process.loadEnvFile(envFile)

  const key = process.env.STEAM_API_KEY
  const steamId = process.env.STEAM_ID
  if (!key || !steamId) {
    throw new Error('STEAM_API_KEY と STEAM_ID を設定してください（.env.example を参照）')
  }

  const [owned, wishlist] = await Promise.all([
    fetchOwnedGames(key, steamId),
    fetchWishlist(steamId),
  ])
  const ownedIds = new Set(owned.map(g => g.appid))
  const names = await fetchAppNames(
    key,
    wishlist.map(w => w.appid).filter(id => !ownedIds.has(id)),
  )

  const library: Library = {
    fetchedAt: new Date().toISOString(),
    steamId,
    games: mergeLibrary(owned, wishlist, names),
  }
  await writeFile(outFile, `${JSON.stringify(library)}\n`)
  console.log(`owned: ${owned.length}, wishlist: ${wishlist.length}, total: ${library.games.length}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
