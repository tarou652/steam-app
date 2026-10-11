export type Tier = {
  id: string
  label: string
  /** CSS カラー（#rrggbb） */
  color: string
  appids: number[]
}

export type TierList = {
  id: string
  title: string
  tiers: Tier[]
  /** どの段にも置かれていないゲーム */
  pool: number[]
  /** ISO 8601 */
  updatedAt: string
}
