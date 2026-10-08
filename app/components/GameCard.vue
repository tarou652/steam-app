<script setup lang="ts">
const props = defineProps<{
  appid: number
  name: string
}>()

const src = ref(steamCapsuleUrl(props.appid))

// 縦長画像がないゲームは横長画像に切り替える
function onError() {
  const fallback = steamHeaderUrl(props.appid)
  if (src.value !== fallback) src.value = fallback
}
</script>

<template>
  <figure
    class="game-card"
    :title="name"
  >
    <img
      :src="src"
      :alt="name"
      loading="lazy"
      crossorigin="anonymous"
      @error="onError"
    >
  </figure>
</template>

<style scoped>
.game-card {
  width: 80px;
  aspect-ratio: 2 / 3;
  margin: 0;
  overflow: hidden;
  border-radius: 4px;
  background: #1b2838;
}

.game-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
