<script setup lang="ts">
const props = defineProps<{
  appid: number
  name: string
}>()

const src = ref(steamCapsuleUrl(props.appid))
const failed = ref(false)

// 縦長画像がないゲームは横長画像に切り替え、それもなければ画像を消して下のゲーム名を見せる
function onError() {
  const fallback = steamHeaderUrl(props.appid)
  if (src.value !== fallback) src.value = fallback
  else failed.value = true
}
</script>

<template>
  <figure
    class="game-card"
    :title="name"
  >
    <!-- 画像の読み込み中・読み込み失敗時に見える -->
    <span class="game-card__name">{{ name }}</span>
    <img
      v-if="!failed"
      :src="src"
      :alt="name"
      loading="lazy"
      draggable="false"
      @error="onError"
    >
  </figure>
</template>

<style scoped>
.game-card {
  position: relative;
  width: var(--card-width);
  aspect-ratio: 2 / 3;
  margin: 0;
  overflow: hidden;
  border-radius: 4px;
  background: var(--color-surface-2);
  cursor: grab;
  user-select: none;
}

.game-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.game-card__name {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px;
  font-size: 11px;
  text-align: center;
  word-break: break-word;
}
</style>
