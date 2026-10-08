import type { Game } from '../types/library'

export type GameSource = 'all' | 'owned' | 'wishlist'
export type GameSort = 'name' | 'playtime' | 'lastPlayed'

export type GameFilter = {
  source: GameSource
  query: string
  sort: GameSort
}

/** プールの絞り込み・検索・並び替え */
export function filterGames(games: Game[], { source, query, sort }: GameFilter): Game[] {
  const q = query.trim().toLowerCase()
  const filtered = games.filter((g) => {
    if (source === 'owned' && !g.owned) return false
    if (source === 'wishlist' && !g.wishlisted) return false
    return !q || g.name.toLowerCase().includes(q)
  })

  return filtered.sort((a, b) => {
    if (sort === 'playtime') {
      const diff = (b.playtimeMinutes ?? -1) - (a.playtimeMinutes ?? -1)
      if (diff !== 0) return diff
    }
    if (sort === 'lastPlayed') {
      // 未プレイ（日時なし）は末尾
      const diff = (b.lastPlayedAt ?? '').localeCompare(a.lastPlayedAt ?? '')
      if (diff !== 0) return diff
    }
    return a.name.localeCompare(b.name)
  })
}
