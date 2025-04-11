<template>
  <div class="toolbar w-full bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between">
    <h1 class="text-xl font-semibold">Incident Reports Timeline Map</h1>
    <div class="flex gap-4 items-center">
      <span class="text-sm opacity-90">Showing {{ incidents.length }} incidents</span>
      <button
        @click="showAddIncidentForm = true"
        class="px-4 py-1.5 bg-white text-primary rounded-md hover:bg-opacity-90 transition-colors"
      >
        Add Incident
      </button>
    </div>
  </div>

  <IncidentForm
    :is-open="showAddIncidentForm"
    :incident-to-edit="null"
    @close="showAddIncidentForm = false"
    @submit="handleIncidentSubmit"
  />
</template>

<script setup>
import { ref } from 'vue';
import IncidentForm from './IncidentForm.vue';

const props = defineProps({
  incidents: {
    type: Array,
    required: true
  }
});

const showAddIncidentForm = ref(false);

const handleIncidentSubmit = () => {
  showAddIncidentForm.value = false;
};
</script>

<style scoped>
.toolbar {
  height: 3rem;
}
</style>