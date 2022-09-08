<template>
  <div class="c-page">
    <div class="c-page__wrapper" ref="wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_WIDTH, PAGE_HEIGHT } from "@/config/constants";
import CenterIt from "center-it";

const wrapper = ref(null);

const resize = (): void => {
  const $wrapper: any = wrapper.value;
  const ratio = new CenterIt({
    containerWidth: window.innerWidth,
    containerHeight: window.innerHeight,
    originWidth: PAGE_WIDTH,
    originHeight: PAGE_HEIGHT,
    centerType: "contain",
  }).ratio();
  $wrapper.style.transform = `scale(${ratio})`;
};

onMounted(() => {
  window.addEventListener("resize", () => {
    resize();
  });
  resize();
});
</script>

<style scoped>
.c-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.c-page__wrapper {
  position: absolute;
  display: inline-block;
  /* top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0; */

  top: 50%;
  left: 50%;
  width: 375px;
  height: 600px;
  margin: -300px 0 0 -187.5px;
  overflow: hidden;
}
</style>
