import type { Game, Library } from '../shared/types/library'
import type { Tier, TierList } from '../shared/types/tier'
import library from './library.json'

/** Storybook・テスト用のモックデータ */
export const mockLibrary = library as Library
export const mockGames: Game[] = mockLibrary.games
export const mockGamesById = new Map(mockGames.map(g => [g.appid, g]))

export function mockTiers(): Tier[] {
  return [
    { id: 's', label: 'S', color: '#ff7f7f', appids: [1145360, 646570] },
    { id: 'a', label: 'A', color: '#ffbf7f', appids: [367520, 413150] },
    { id: 'b', label: 'B', color: '#ffdf7f', appids: [504230] },
    { id: 'c', label: 'C', color: '#ffff7f', appids: [] },
    { id: 'd', label: 'D', color: '#bfff7f', appids: [] },
  ]
}

export function mockTierList(): TierList {
  const tiers = mockTiers()
  const placed = new Set(tiers.flatMap(t => t.appids))
  return {
    id: 'mock',
    title: '2026年に遊んだゲーム',
    tiers,
    pool: mockGames.map(g => g.appid).filter(id => !placed.has(id)),
    updatedAt: '2026-10-01T12:00:00.000Z',
  }
}
