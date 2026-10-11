import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { ref } from 'vue'
import { mockGamesById } from '../../mocks/games'
import TierRow from './TierRow.vue'

const meta = {
  title: 'Tier/TierRow',
  component: TierRow,
  args: {
    label: 'S',
    color: '#ff7f7f',
    appids: [1145360, 646570, 367520],
    gamesById: mockGamesById,
  },
  render: args => ({
    components: { TierRow },
    setup() {
      const appids = ref(args.appids)
      return { args, appids }
    },
    template: '<TierRow v-bind="args" v-model:appids="appids" />',
  }),
} satisfies Meta<typeof TierRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { appids: [] },
}

export const LongLabel: Story = {
  args: { label: '神ゲー（人生変わった）', color: '#7fbfff' },
}

export const Readonly: Story = {
  args: { readonly: true },
}
