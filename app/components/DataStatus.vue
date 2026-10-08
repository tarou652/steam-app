<script setup lang="ts">
export type RefreshStatus = 'idle' | 'queued' | 'in_progress' | 'success' | 'failure'

const props = defineProps<{
  /** library.json の取得日時（ISO 8601） */
  fetchedAt?: string
  status: RefreshStatus
  /** GitHub トークンが設定済みで、画面から Actions を起動できる */
  canDispatch: boolean
  /** Actions のワークフローページ（トークン未設定時の案内用） */
  actionsUrl: string
}>()

const emit = defineEmits<{
  refresh: []
  reload: []
}>()

const fetchedAt = computed(() =>
  props.fetchedAt ? new Date(props.fetchedAt).toLocaleString('ja-JP') : '未取得',
)
const running = computed(() => props.status === 'queued' || props.status === 'in_progress')

const messages: Record<RefreshStatus, string> = {
  idle: '',
  queued: '更新を受け付けました。開始を待っています…',
  in_progress: 'Steam からデータを取得してデプロイしています…（数分かかります）',
  success: '更新が完了しました。再読み込みすると反映されます。',
  failure: '更新に失敗しました。Actions のログを確認してください。',
}
</script>

<template>
  <div
    class="data-status"
    :data-status="status"
  >
    <span class="data-status__time">最終更新: {{ fetchedAt }}</span>

    <button
      v-if="canDispatch"
      type="button"
      class="btn"
      :disabled="running"
      @click="emit('refresh')"
    >
      {{ running ? '更新中…' : 'データを更新' }}
    </button>
    <a
      v-else
      class="btn"
      :href="actionsUrl"
      target="_blank"
      rel="noopener"
    >Actions で更新 ↗</a>

    <span
      v-if="messages[status]"
      class="data-status__message"
      role="status"
    >{{ messages[status] }}</span>

    <button
      v-if="status === 'success'"
      type="button"
      class="btn btn--primary"
      @click="emit('reload')"
    >
      再読み込み
    </button>
  </div>
</template>

<style scoped>
.data-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  font-size: 14px;
}

.data-status a.btn {
  color: inherit;
  text-decoration: none;
}

.data-status__time {
  color: var(--color-muted);
}

.data-status[data-status='failure'] .data-status__message {
  color: var(--color-danger);
}

.data-status[data-status='success'] .data-status__message {
  color: var(--color-success);
}
</style>
