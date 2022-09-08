<template>
  <div class="c-videoSprite">
    <div class="c-videoSprite__video" ref="container">
      show something...
      <van-button type="primary" block @click="onClick">返回</van-button>
    </div>
    <!-- <video ref="video" :src="videoSrc" class="c-videoSprite__video" webkit-playsinline playsinline></video> -->
  </div>
</template>

<script setup lang="ts">
const container = ref(null);

// 定义emit事件
const emit = defineEmits(["goBack"]);

const onClick = (): void => {
  console.log("goBack:");

  emit("goBack");
};

onMounted(() => {});

defineExpose({
  container,
});
</script>
