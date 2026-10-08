export type Game = {
  appid: number
  name: string
  /** 所持している */
  owned: boolean
  /** ウィッシュリストに入っている */
  wishlisted: boolean
  /** 所持ゲームのみ */
  playtimeMinutes?: number
  /** 所持ゲームのみ（ISO 8601） */
  lastPlayedAt?: string
  /** ウィッシュリストのみ */
  wishlistPriority?: number
}

export type Library = {
  /** ISO 8601 */
  fetchedAt: string
  steamId: string
  games: Game[]
}
