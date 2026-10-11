<script setup lang="ts">
defineProps<{
  canMoveUp: boolean
  canMoveDown: boolean
}>()

const label = defineModel<string>('label', { required: true })
const color = defineModel<string>('color', { required: true })

const emit = defineEmits<{
  moveUp: []
  moveDown: []
  remove: []
  close: []
}>()
</script>

<template>
  <div class="tier-row-editor">
    <label class="tier-row-editor__field">
      <span>ラベル</span>
      <input
        v-model="label"
        class="input"
        type="text"
        maxlength="40"
      >
    </label>

    <div class="tier-row-editor__field">
      <span>色</span>
      <div class="tier-row-editor__colors">
        <button
          v-for="preset in TIER_COLORS"
          :key="preset"
          type="button"
          class="tier-row-editor__swatch"
          :class="{ 'is-selected': preset === color }"
          :style="{ background: preset }"
          :aria-label="preset"
          @click="color = preset"
        />
        <input
          v-model="color"
          type="color"
          aria-label="色を自由に選ぶ"
        >
      </div>
    </div>

    <div class="tier-row-editor__actions">
      <button
        type="button"
        class="btn"
        :disabled="!canMoveUp"
        @click="emit('moveUp')"
      >
        ↑ 上へ
      </button>
      <button
        type="button"
        class="btn"
        :disabled="!canMoveDown"
        @click="emit('moveDown')"
      >
        ↓ 下へ
      </button>
      <button
        type="button"
        class="btn btn--danger"
        @click="emit('remove')"
      >
        段を削除
      </button>
      <button
        type="button"
        class="btn btn--primary"
        @click="emit('close')"
      >
        閉じる
      </button>
    </div>
  </div>
</template>

<style scoped>
.tier-row-editor {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  padding: 12px;
  background: var(--color-surface-2);
}

.tier-row-editor__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--color-muted);
}

.tier-row-editor__colors {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tier-row-editor__swatch {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

.tier-row-editor__swatch.is-selected {
  border-color: var(--color-text);
}

.tier-row-editor__actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
</style>
