<template>
  <page>
    <div :class="{ 'c-show': true, 'low-position': isEnd }">
      <show-earth ref="earthCom"></show-earth>
      <show-clouds ref="cloudCom"></show-clouds>
      <show-content ref="contentCom" @go-back="handleBack"></show-content>
    </div>
  </page>
</template>

<script setup lang="ts">
import "@/assets/css/show.css";
import ShowEarth from "@/components/Show/Earth.vue";
import ShowClouds from "@/components/Show/Clouds.vue";
import ShowContent from "@/components/Show/Content.vue";
import Page from "@/components/Page/index.vue";
import Controller from "@/components/Show/controller";

import bus from "@/libs/bus";

const earthCom: any = ref(null);
const cloudCom: any = ref(null);
const contentCom: any = ref(null);
const isEnd = ref(false);
const controller: any = ref({});

const createController = (): void => {
  const that = this;
  const earth = earthCom.value.earth;
  const cloud = cloudCom.value.cloudsSprite;
  const content = contentCom.value.container;

  controller.value = new Controller({
    earth,
    cloud,
    content,
  });
  console.log("controller:", controller.value);
};

const getTarget = (target: any): void => {
  controller.value.target = target;
  controller.value.start();
  // setTimeout(() => {
  //   controller.value.end();
  // }, 4000);
};

const handleBack = (): void => {
  controller.value.end();
};

// 启用监听
bus.$on("getTarget", getTarget);

// 在组件卸载之前移除监听
onBeforeUnmount(() => {
  bus.$off("getTarget", getTarget);
});

onMounted(() => {
  console.log("earth父组件", cloudCom.value);
  // console.log("earth父组件", earthCom.value.earth);
  createController();
});
</script>
