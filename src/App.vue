<script setup>
import MapComponent from './components/MapComponent.vue'
import Toolbar from './components/Toolbar.vue'
</script>

<template>
  <main class="min-h-screen w-full flex flex-col">
    <Toolbar />
    <MapComponent />
  </main>
</template>

<style scoped>
/* Component-specific styles can be added here */
</style>
