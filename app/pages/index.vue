<script setup lang="ts">
const { data: library, error } = useLibrary()
</script>

<template>
  <main>
    <h1>Steam Tier Maker</h1>
    <p v-if="error">
      library.json を読み込めませんでした。<code>npm run fetch -- --mock</code> を実行してください。
    </p>
    <template v-else-if="library">
      <p>最終更新: {{ new Date(library.fetchedAt).toLocaleString('ja-JP') }}（{{ library.games.length }} 本）</p>
      <div class="games">
        <GameCard
          v-for="game in library.games"
          :key="game.appid"
          :appid="game.appid"
          :name="game.name"
        />
      </div>
    </template>
  </main>
</template>

<style scoped>
.games {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
