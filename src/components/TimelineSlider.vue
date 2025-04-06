<template>
  <div class="timeline-slider p-4">
    <Slider
      v-model="selectedRange"
      :min="minTimestamp"
      :max="maxTimestamp"
      :step="86400000"
      :tooltips="isDragging"
      :format="formatTooltip"
      @start="isDragging = true"
      @end="isDragging = false"
      class="mb-4"
    />
    <div class="flex justify-between text-sm text-gray-600">
      <span>{{ formatDate(selectedRange[0]) }}</span>
      <span>{{ formatDate(selectedRange[1]) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Slider from '@vueform/slider';
import '@vueform/slider/themes/default.css';

const props = defineProps({
  incidents: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:dateRange']);

// Calculate min and max timestamps from incidents
const minTimestamp = computed(() => {
  return Math.min(...props.incidents.map(i => new Date(i.datetime).getTime()));
});

const maxTimestamp = computed(() => {
  return Math.max(...props.incidents.map(i => new Date(i.datetime).getTime()));
});

// Initialize selected range with full range
const selectedRange = ref([minTimestamp.value, maxTimestamp.value]);

// Add isDragging ref after other refs
const isDragging = ref(false);

// Format date for tooltip and display
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString();
};

const formatTooltip = (timestamp) => {
  return formatDate(timestamp);
};

// Watch for changes in selected range
watch(selectedRange, (newRange) => {
  emit('update:dateRange', {
    start: new Date(newRange[0]),
    end: new Date(newRange[1])
  });
});
</script>

<style scoped>
.timeline-slider {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Slider track styles */
:deep(.slider-base) {
  background-color: #E5E7EB;
  height: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

:deep(.slider-connect) {
  background-color: #2563EB;
  height: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

/* Slider handle styles */
:deep(.slider-handle) {
  background-color: #2563EB;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.2);
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
}

:deep(.slider-handle:hover) {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

:deep(.slider-handle:focus) {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
}

/* Tooltip styles */
:deep(.slider-tooltip) {
  background-color: #1E293B;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transform: translate(-50%, -12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.slider-tooltip:before) {
  border-top-color: #1E293B;
  border-width: 8px;
  bottom: -16px;
}
</style>