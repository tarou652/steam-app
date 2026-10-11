import { describe, expect, it } from 'vitest'
import type { Game } from '../shared/types/library'
import { filterGames } from '../shared/utils/game-filter'

const games: Game[] = [
  { appid: 1, name: 'Hades', owned: true, wishlisted: false, playtimeMinutes: 100, lastPlayedAt: '2026-01-01T00:00:00.000Z' },
  { appid: 2, name: 'Celeste', owned: true, wishlisted: false, playtimeMinutes: 300 },
  { appid: 3, name: 'Hades II', owned: false, wishlisted: true },
  { appid: 4, name: 'Balatro', owned: true, wishlisted: false, playtimeMinutes: 100, lastPlayedAt: '2026-05-01T00:00:00.000Z' },
]

const ids = (list: Game[]) => list.map(g => g.appid)

describe('filterGames', () => {
  it('所持 / ウィッシュリストで絞り込む', () => {
    expect(ids(filterGames(games, { source: 'owned', query: '', sort: 'name' }))).toEqual([4, 2, 1])
    expect(ids(filterGames(games, { source: 'wishlist', query: '', sort: 'name' }))).toEqual([3])
  })

  it('名前を大文字小文字を区別せずに検索する', () => {
    expect(ids(filterGames(games, { source: 'all', query: ' hades ', sort: 'name' }))).toEqual([1, 3])
  })

  it('プレイ時間の長い順、同じなら名前順', () => {
    expect(ids(filterGames(games, { source: 'all', query: '', sort: 'playtime' }))).toEqual([2, 4, 1, 3])
  })

  it('最終プレイの新しい順、未プレイは末尾', () => {
    expect(ids(filterGames(games, { source: 'all', query: '', sort: 'lastPlayed' }))).toEqual([4, 1, 2, 3])
  })

  it('元の配列を変更しない', () => {
    const copy = [...games]
    filterGames(games, { source: 'all', query: '', sort: 'playtime' })
    expect(games).toEqual(copy)
  })
})
