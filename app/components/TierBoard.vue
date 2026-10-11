<script setup lang="ts">
import type { Game } from '#shared/types/library'
import type { Tier } from '#shared/types/tier'

const props = defineProps<{
  gamesById: Map<number, Game>
  readonly?: boolean
}>()

const tiers = defineModel<Tier[]>('tiers', { required: true })
const title = defineModel<string>('title', { default: '' })

const emit = defineEmits<{
  /** 削除した段に置かれていたゲーム。プールに戻す */
  release: [appids: number[]]
}>()

const editingId = ref<string | null>(null)

// PNG 書き出しで撮影する要素
const root = useTemplateRef<HTMLElement>('root')
defineExpose({ root })

// 段をまたぐ D&D では移動元・移動先の 2 つの段が同じティック内に更新される。
// 親から新しい tiers が届く前に 2 回目の更新が来ても 1 回目を上書きしないよう、
// 同じティック内の更新は手元の最新値に積み重ねる
let pending: Tier[] | null = null

function patchTier(id: string, patch: Partial<Tier>) {
  if (!pending) nextTick(() => (pending = null))
  pending = (pending ?? tiers.value).map(t => (t.id === id ? { ...t, ...patch } : t))
  tiers.value = pending
}

function moveTier(index: number, delta: number) {
  const next = [...tiers.value]
  const [tier] = next.splice(index, 1)
  next.splice(index + delta, 0, tier!)
  tiers.value = next
}

function removeTier(tier: Tier) {
  tiers.value = tiers.value.filter(t => t.id !== tier.id)
  editingId.value = null
  if (tier.appids.length) emit('release', tier.appids)
}

function addTier() {
  const tier: Tier = {
    id: createTierId(),
    label: '新しい段',
    color: TIER_COLORS[tiers.value.length % TIER_COLORS.length]!,
    appids: [],
  }
  tiers.value = [...tiers.value, tier]
  editingId.value = tier.id
}
</script>

<template>
  <section class="tier-board">
    <div
      ref="root"
      class="tier-board__capture"
    >
      <h2
        v-if="props.readonly"
        class="tier-board__title"
      >
        {{ title }}
      </h2>
      <input
        v-else
        v-model="title"
        class="tier-board__title tier-board__title--input"
        type="text"
        placeholder="タイトルを入力"
        maxlength="80"
      >

      <div class="tier-board__rows">
        <template
          v-for="(tier, index) in tiers"
          :key="tier.id"
        >
          <TierRow
            :label="tier.label"
            :color="tier.color"
            :appids="tier.appids"
            :games-by-id="gamesById"
            :readonly="props.readonly"
            @update:appids="patchTier(tier.id, { appids: $event })"
            @edit="editingId = editingId === tier.id ? null : tier.id"
          />
          <TierRowEditor
            v-if="!props.readonly && editingId === tier.id"
            :label="tier.label"
            :color="tier.color"
            :can-move-up="index > 0"
            :can-move-down="index < tiers.length - 1"
            @update:label="patchTier(tier.id, { label: $event })"
            @update:color="patchTier(tier.id, { color: $event })"
            @move-up="moveTier(index, -1)"
            @move-down="moveTier(index, 1)"
            @remove="removeTier(tier)"
            @close="editingId = null"
          />
        </template>
      </div>
    </div>

    <button
      v-if="!props.readonly"
      type="button"
      class="btn tier-board__add"
      @click="addTier"
    >
      ＋ 段を追加
    </button>
  </section>
</template>

<style scoped>
.tier-board {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tier-board__capture {
  padding: 12px;
  background: var(--color-bg);
}

.tier-board__title {
  width: 100%;
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
}

.tier-board__title--input {
  padding: 4px 0;
  border: none;
  border-bottom: 1px dashed var(--color-border);
  background: transparent;
}

.tier-board__title--input:focus {
  outline: none;
  border-bottom-color: var(--color-accent);
}

.tier-board__rows {
  border: 1px solid var(--color-bg);
  border-radius: var(--radius);
  overflow: hidden;
}

.tier-board__add {
  align-self: flex-start;
}
</style>
