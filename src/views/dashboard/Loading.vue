<template>
  <page>
    <div class="c-loading">
      <div class="c-loading__text"></div>
      <div class="c-loading__orbits"></div>
      <div class="c-loading__progress">{{ progress }}%</div>
      <div class="c-loading__tips">正在进入立春元宇宙...</div>
    </div>
  </page>
</template>

<script setup lang="ts">
import "@/assets/css/loading.css";
import Page from "@/components/Page/index.vue";

const props = defineProps({
  //子组件接收父组件传递过来的值
  progress: Number,
});
//使用父组件传递过来的值
const { progress } = toRefs(props);
</script>
