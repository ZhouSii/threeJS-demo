<template>
  <Loading :progress="progress" v-show="loading" />
  <Show v-if="!loading" />
</template>

<script setup lang="ts">
/* eslint-disable */
import { Loader } from "resource-loader";
import Loading from "./Loading.vue";
import Show from "./showEarth.vue";
import { IMAGE_URLS } from "@/config/constants";

const loading = ref(true);
const progress = ref(0);

const initLoader = (): void => {
  const loader = new Loader();

  Object.keys(IMAGE_URLS).forEach((name) => {
    loader.add(name, IMAGE_URLS[name]);
  });

  loader.onProgress.add(() => {
    progress.value = Math.round(loader.progress);
  });

  loader.onComplete.add(() => {
    setTimeout(() => {
      loading.value = false;
    }, 500);
  });

  loader.load();
  window.loader = loader;
};
onMounted(() => {
  initLoader();
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
