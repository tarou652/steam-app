import type { Tier } from '../types/tier'

/** 段の色のプリセット（定番の Tier 表の配色） */
export const TIER_COLORS = [
  '#ff7f7f',
  '#ffbf7f',
  '#ffdf7f',
  '#ffff7f',
  '#bfff7f',
  '#7fff7f',
  '#7fffff',
  '#7fbfff',
  '#bf7fff',
  '#ff7fbf',
] as const

export function createTierId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function createDefaultTiers(): Tier[] {
  return ['S', 'A', 'B', 'C', 'D'].map((label, i) => ({
    id: createTierId(),
    label,
    color: TIER_COLORS[i]!,
    appids: [],
  }))
}
