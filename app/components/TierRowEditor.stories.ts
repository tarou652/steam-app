import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { ref } from 'vue'
import TierRowEditor from './TierRowEditor.vue'

const meta = {
  title: 'Tier/TierRowEditor',
  component: TierRowEditor,
  args: {
    label: 'S',
    color: '#ff7f7f',
    canMoveUp: true,
    canMoveDown: true,
  },
  render: args => ({
    components: { TierRowEditor },
    setup() {
      const label = ref(args.label)
      const color = ref(args.color)
      return { args, label, color }
    },
    template: `
      <div>
        <TierRowEditor v-bind="args" v-model:label="label" v-model:color="color" />
        <p style="margin-top: 12px">プレビュー: <span :style="{ background: color, color: '#111', padding: '4px 12px' }">{{ label }}</span></p>
      </div>
    `,
  }),
} satisfies Meta<typeof TierRowEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstRow: Story = {
  args: { canMoveUp: false },
}

export const LastRow: Story = {
  args: { canMoveDown: false },
}
