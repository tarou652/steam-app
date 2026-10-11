import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { ref } from 'vue'
import { mockGamesById, mockTierList } from '../../mocks/games'
import GamePool from './GamePool.vue'
import TierBoard from './TierBoard.vue'

const meta = {
  title: 'Tier/TierBoard',
  component: TierBoard,
  args: {
    tiers: mockTierList().tiers,
    title: mockTierList().title,
    gamesById: mockGamesById,
  },
  render: args => ({
    components: { TierBoard },
    setup() {
      const tiers = ref(args.tiers)
      const title = ref(args.title)
      return { args, tiers, title }
    },
    template: '<TierBoard v-bind="args" v-model:tiers="tiers" v-model:title="title" />',
  }),
} satisfies Meta<typeof TierBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { tiers: createDefaultTiers(), title: '' },
}

/** 共有 URL を開いたときの閲覧専用表示 */
export const Readonly: Story = {
  args: { readonly: true },
}

/** プールから段へドラッグ & ドロップできる組み合わせ（編集画面と同じ構成） */
export const WithPool: Story = {
  render: args => ({
    components: { TierBoard, GamePool },
    setup() {
      const list = mockTierList()
      const tiers = ref(list.tiers)
      const title = ref(list.title)
      const pool = ref(list.pool)
      const release = (appids: number[]) => {
        pool.value = [...pool.value, ...appids]
      }
      return { args, tiers, title, pool, release }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <TierBoard :games-by-id="args.gamesById" v-model:tiers="tiers" v-model:title="title" @release="release" />
        <GamePool :games-by-id="args.gamesById" v-model:appids="pool" />
      </div>
    `,
  }),
}
