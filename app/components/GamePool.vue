<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Game } from '#shared/types/library'
import type { GameFilter } from '#shared/utils/game-filter'

const props = defineProps<{
  gamesById: Map<number, Game>
}>()

/** どの段にも置かれていないゲーム */
const appids = defineModel<number[]>('appids', { required: true })

const filter = reactive<GameFilter>({ source: 'all', query: '', sort: 'name' })

const visible = computed(() => {
  const games = appids.value
    .map(id => props.gamesById.get(id))
    .filter((g): g is Game => !!g)
  return filterGames(games, filter).map(g => g.appid)
})

// 表示中（絞り込み後）のリストへの D&D を、絞り込み前のリストに反映する
function onUpdate(next: number[]) {
  const shown = new Set(visible.value)
  const kept = new Set(next)
  const removed = new Set(visible.value.filter(id => !kept.has(id)))
  const added = next.filter(id => !shown.has(id))
  appids.value = [...appids.value.filter(id => !removed.has(id)), ...added]
}
</script>

<template>
  <section class="game-pool">
    <div class="game-pool__toolbar">
      <input
        v-model="filter.query"
        class="input game-pool__search"
        type="search"
        placeholder="ゲーム名で検索"
      >
      <select
        v-model="filter.source"
        class="input"
        aria-label="絞り込み"
      >
        <option value="all">
          すべて
        </option>
        <option value="owned">
          所持ゲーム
        </option>
        <option value="wishlist">
          ウィッシュリスト
        </option>
      </select>
      <select
        v-model="filter.sort"
        class="input"
        aria-label="並び替え"
      >
        <option value="name">
          名前順
        </option>
        <option value="playtime">
          プレイ時間順
        </option>
        <option value="lastPlayed">
          最終プレイ順
        </option>
      </select>
      <span class="game-pool__count">{{ visible.length }} / {{ appids.length }} 本</span>
    </div>

    <VueDraggable
      :model-value="visible"
      class="game-pool__items"
      group="games"
      :sort="false"
      :animation="150"
      @update:model-value="onUpdate"
    >
      <GameCard
        v-for="appid in visible"
        :key="appid"
        :appid="appid"
        :name="gamesById.get(appid)?.name ?? `App ${appid}`"
      />
    </VueDraggable>
    <p
      v-if="!visible.length"
      class="game-pool__empty"
    >
      {{ appids.length ? '条件に合うゲームがありません' : 'すべてのゲームを配置しました' }}
    </p>
  </section>
</template>

<style scoped>
.game-pool {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: var(--radius);
  background: var(--color-surface);
}

.game-pool__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.game-pool__search {
  flex: 1 1 200px;
}

.game-pool__count {
  font-size: 13px;
  color: var(--color-muted);
}

.game-pool__items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: calc(var(--card-width) * 1.5);
}

.game-pool__empty {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
}
</style>
