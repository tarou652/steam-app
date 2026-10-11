import { describe, expect, it } from 'vitest'
import { mergeLibrary } from '../shared/utils/merge-library'

describe('mergeLibrary', () => {
  it('所持ゲームとウィッシュリストを appid で統合する', () => {
    const games = mergeLibrary(
      [
        { appid: 1, name: 'Beta', playtime_forever: 60, rtime_last_played: 1_700_000_000 },
        { appid: 2, name: 'Alpha', playtime_forever: 0 },
      ],
      [
        { appid: 2, priority: 3 },
        { appid: 3, priority: 1 },
      ],
      new Map([[3, 'Gamma']]),
    )

    expect(games.map(g => g.appid)).toEqual([2, 1, 3])
    expect(games[0]).toMatchObject({ owned: true, wishlisted: true, wishlistPriority: 3 })
    expect(games[1]).toMatchObject({
      owned: true,
      wishlisted: false,
      playtimeMinutes: 60,
      lastPlayedAt: new Date(1_700_000_000_000).toISOString(),
    })
    expect(games[2]).toMatchObject({ name: 'Gamma', owned: false, wishlisted: true })
  })

  it('ゲーム名が取れなかったウィッシュリストは appid で代用する', () => {
    const [game] = mergeLibrary([], [{ appid: 9, priority: 0 }], new Map())
    expect(game?.name).toBe('App 9')
  })
})
