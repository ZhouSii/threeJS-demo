<template>
  <div class="c-clouds">
    <div ref="container" class="c-clouds__spriteContainer"></div>
  </div>
</template>

<script setup lang="ts">
import ImageSprite from "image-sprite";
import { PAGE_WIDTH, PAGE_HEIGHT } from "@/config/constants";

const cloudsSprite: any = ref(null);
const container = ref(null);

function getCloudImages(resources) {
  return new Array(13).fill("").map((item, index) => {
    return resources[`cloud${index}`].data;
  });
}

const createImageSprite = (): void => {
  let images = getCloudImages(window.loader.resources);
  let imageSprite = new ImageSprite(container.value, {
    interval: 80,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    images: images,
  });

  cloudsSprite.value = imageSprite;
};

onMounted(() => {
  createImageSprite();
});

defineExpose({
  cloudsSprite,
});
</script>
