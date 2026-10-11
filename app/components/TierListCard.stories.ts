import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { mockGamesById, mockTierList } from '../../mocks/games'
import TierListCard from './TierListCard.vue'

const meta = {
  title: 'List/TierListCard',
  component: TierListCard,
  args: {
    tierList: mockTierList(),
    gamesById: mockGamesById,
  },
} satisfies Meta<typeof TierListCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Untitled: Story = {
  args: {
    tierList: { ...mockTierList(), title: '', tiers: createDefaultTiers(), pool: [] },
  },
}
