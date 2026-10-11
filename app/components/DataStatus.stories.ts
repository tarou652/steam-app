import type { Meta, StoryObj } from '@nuxtjs/storybook'
import DataStatus from './DataStatus.vue'

const meta = {
  title: 'Data/DataStatus',
  component: DataStatus,
  args: {
    fetchedAt: '2026-10-07T21:00:00.000Z',
    status: 'idle',
    canDispatch: true,
    actionsUrl: 'https://github.com/owner/repo/actions/workflows/deploy.yml',
  },
} satisfies Meta<typeof DataStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const Queued: Story = {
  args: { status: 'queued' },
}

export const InProgress: Story = {
  args: { status: 'in_progress' },
}

export const Success: Story = {
  args: { status: 'success' },
}

export const Failure: Story = {
  args: { status: 'failure' },
}

/** トークン未設定のときは Actions のページへ案内する */
export const NoToken: Story = {
  args: { canDispatch: false },
}
