<template>
  <div class="toolbar w-full bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between">
    <h1 class="text-xl font-semibold">Incident Reports Timeline Map</h1>
    <div class="flex gap-2 items-center">
      <span class="text-sm opacity-90">Showing {{ incidents.length }} incidents</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  incidents: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.toolbar {
  height: 3rem;
}
</style>