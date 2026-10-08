import type { Game } from '../types/library'

export type OwnedGameInput = {
  appid: number
  name: string
  playtime_forever: number
  rtime_last_played?: number
}

export type WishlistItemInput = {
  appid: number
  priority: number
}

/** 所持ゲームとウィッシュリストを appid で統合する */
export function mergeLibrary(
  owned: OwnedGameInput[],
  wishlist: WishlistItemInput[],
  wishlistNames: Map<number, string>,
): Game[] {
  const games = new Map<number, Game>()

  for (const g of owned) {
    games.set(g.appid, {
      appid: g.appid,
      name: g.name,
      owned: true,
      wishlisted: false,
      playtimeMinutes: g.playtime_forever,
      lastPlayedAt: g.rtime_last_played
        ? new Date(g.rtime_last_played * 1000).toISOString()
        : undefined,
    })
  }

  for (const w of wishlist) {
    const existing = games.get(w.appid)
    if (existing) {
      existing.wishlisted = true
      existing.wishlistPriority = w.priority
      continue
    }
    games.set(w.appid, {
      appid: w.appid,
      name: wishlistNames.get(w.appid) ?? `App ${w.appid}`,
      owned: false,
      wishlisted: true,
      wishlistPriority: w.priority,
    })
  }

  return [...games.values()].sort((a, b) => a.name.localeCompare(b.name))
}
