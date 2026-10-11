<script setup lang="ts">
import type { Game } from '#shared/types/library'
import type { TierList } from '#shared/types/tier'

const props = defineProps<{
  tierList: TierList
  gamesById?: Map<number, Game>
}>()

const emit = defineEmits<{
  open: []
  remove: []
}>()

/** 上の段から順に最大 6 本をプレビューに使う */
const preview = computed(() => props.tierList.tiers.flatMap(t => t.appids).slice(0, 6))
const placed = computed(() => props.tierList.tiers.reduce((n, t) => n + t.appids.length, 0))
const updatedAt = computed(() => new Date(props.tierList.updatedAt).toLocaleString('ja-JP'))
</script>

<template>
  <article class="tier-list-card">
    <button
      type="button"
      class="tier-list-card__body"
      @click="emit('open')"
    >
      <div class="tier-list-card__preview">
        <GameCard
          v-for="appid in preview"
          :key="appid"
          :appid="appid"
          :name="gamesById?.get(appid)?.name ?? `App ${appid}`"
        />
        <span
          v-if="!preview.length"
          class="tier-list-card__empty"
        >まだゲームがありません</span>
      </div>
      <h3 class="tier-list-card__title">
        {{ tierList.title || '無題の Tier 表' }}
      </h3>
      <p class="tier-list-card__meta">
        {{ placed }} 本配置 ・ {{ updatedAt }}
      </p>
    </button>
    <button
      type="button"
      class="btn btn--danger tier-list-card__remove"
      aria-label="削除"
      @click="emit('remove')"
    >
      削除
    </button>
  </article>
</template>

<style scoped>
.tier-list-card {
  position: relative;
  width: 280px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  overflow: hidden;
}

.tier-list-card__body {
  display: block;
  width: 100%;
  padding: 0 0 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.tier-list-card__body:hover .tier-list-card__title {
  color: var(--color-accent);
}

.tier-list-card__preview {
  --card-width: 46px;
  display: flex;
  gap: 2px;
  height: 69px;
  overflow: hidden;
  background: var(--color-bg);
}

.tier-list-card__empty {
  margin: auto;
  font-size: 13px;
  color: var(--color-muted);
}

.tier-list-card__title {
  margin: 8px 12px 0;
  font-size: 16px;
}

.tier-list-card__meta {
  margin: 4px 12px 0;
  font-size: 12px;
  color: var(--color-muted);
}

.tier-list-card__remove {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 2px 8px;
  font-size: 12px;
}
</style>
