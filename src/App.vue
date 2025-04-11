<script setup>
import MapComponent from './components/MapComponent.vue';
import Toolbar from './components/Toolbar.vue';
import TimelineSlider from './components/TimelineSlider.vue';
import { useIncidentsStore } from './stores/incidents';
import incidents from './data/incidents';

const store = useIncidentsStore();
store.setIncidents(incidents);

const updateDateRange = ({ start, end }) => {
  store.filterByDateRange(start, end);
};
</script>

<template>
  <main class="min-h-screen w-full flex flex-col relative">
    <Toolbar :incidents="store.filteredIncidents" />
    <MapComponent :incidents="store.filteredIncidents" />
    <div class="absolute bottom-8 left-0 right-0 z-10">
      <TimelineSlider
        :incidents="store.allIncidents"
        @update:dateRange="updateDateRange"
      />
    </div>
  </main>
</template>

<style scoped>
/* Component-specific styles can be added here */
</style>
