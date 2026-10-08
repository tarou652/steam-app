import type { Meta, StoryObj } from '@nuxtjs/storybook'
import GameCard from './GameCard.vue'

const meta = {
  title: 'GameCard',
  component: GameCard,
} satisfies Meta<typeof GameCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { appid: 1145360, name: 'Hades' },
}

/** library_600x900.jpg がない場合は header.jpg に切り替わる */
export const Fallback: Story = {
  args: { appid: 10, name: 'Counter-Strike' },
}
