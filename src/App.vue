<template>
  <!-- <router-view v-slot="{ Component }">
    <transition mode="out-in" name="fade-transform">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="key" />
      </keep-alive>
    </transition>
  </router-view> -->
  <router-view></router-view>
</template>

<script>
import "@/assets/css/app.css";
export default {};
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
