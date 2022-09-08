<template>
  <div class="c-earth">
    <div ref="mountNode"></div>
  </div>
</template>

<script setup lang="ts">
import Earth from "./plugins/index";

const mountNode = ref(null);
let earth: any = ref(null);

onMounted(() => {
  earth.value = new Earth(mountNode.value);
});

defineExpose({
  earth,
});
</script>

<style scoped lang="scss">
.logoAR {
  color: $theme-color;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
