<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Game } from '#shared/types/library'

defineProps<{
  label: string
  color: string
  gamesById: Map<number, Game>
  readonly?: boolean
}>()

const appids = defineModel<number[]>('appids', { required: true })

const emit = defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="tier-row">
    <button
      type="button"
      class="tier-row__label"
      :style="{ background: color }"
      :disabled="readonly"
      :title="readonly ? undefined : '段を編集'"
      @click="emit('edit')"
    >
      {{ label }}
    </button>
    <VueDraggable
      v-model="appids"
      class="tier-row__items"
      group="games"
      :animation="150"
      :disabled="readonly"
    >
      <GameCard
        v-for="appid in appids"
        :key="appid"
        :appid="appid"
        :name="gamesById.get(appid)?.name ?? `App ${appid}`"
      />
    </VueDraggable>
  </div>
</template>

<style scoped>
.tier-row {
  display: flex;
  min-height: calc(var(--card-width) * 1.5 + 8px);
  border-bottom: 1px solid var(--color-bg);
}

.tier-row__label {
  flex: 0 0 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  color: #111;
  font-size: 20px;
  font-weight: 700;
  word-break: break-word;
  cursor: pointer;
}

.tier-row__label:disabled {
  cursor: default;
  opacity: 1;
}

.tier-row__items {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;
  padding: 4px;
  background: var(--color-surface);
}
</style>
