<script setup>
import { ref } from 'vue';
import MapComponent from './components/MapComponent.vue';
import Toolbar from './components/Toolbar.vue';
import TimelineSlider from './components/TimelineSlider.vue';
import incidents from './data/incidents';

const allIncidents = ref(incidents);
const filteredIncidents = ref(incidents);

const updateDateRange = ({ start, end }) => {
  const filtered = incidents.filter(incident => {
    const incidentDate = new Date(incident.datetime);
    return incidentDate >= start && incidentDate <= end;
  });
  filteredIncidents.value = filtered;
};
</script>

<template>
  <main class="min-h-screen w-full flex flex-col relative">
    <Toolbar :incidents="allIncidents" />
    <MapComponent :incidents="filteredIncidents" />
    <div class="absolute bottom-8 left-0 right-0 z-10">
      <TimelineSlider
        :incidents="allIncidents"
        @update:dateRange="updateDateRange"
      />
    </div>
  </main>
</template>

<style scoped>
/* Component-specific styles can be added here */
</style>
