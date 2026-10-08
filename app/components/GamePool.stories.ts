import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { ref } from 'vue'
import { mockGames, mockGamesById } from '../../mocks/games'
import GamePool from './GamePool.vue'

const meta = {
  title: 'Pool/GamePool',
  component: GamePool,
  args: {
    appids: mockGames.map(g => g.appid),
    gamesById: mockGamesById,
  },
  render: args => ({
    components: { GamePool },
    setup() {
      const appids = ref(args.appids)
      return { args, appids }
    },
    template: '<GamePool :games-by-id="args.gamesById" v-model:appids="appids" />',
  }),
} satisfies Meta<typeof GamePool>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** すべて配置し終えた状態 */
export const Empty: Story = {
  args: { appids: [] },
}
