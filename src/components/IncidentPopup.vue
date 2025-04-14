<template>
  <div class="popup-content bg-white rounded-sm shadow-lg overflow-hidden max-w-sm transform transition-transform duration-200 hover:scale-[1.02]">
    <div class="relative">
      <img :src="incident.image" :alt="incident.name" class="w-full h-48 object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div class="absolute bottom-4 right-4">
        <button
          @click="$emit('edit', incident.id)"
          class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
      </div>
      <span 
        class="absolute top-3 left-3 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg" 
        :style="{
          backgroundColor: getColorForSeverity(incident.severity),
          color: incident.severity > 2 ? 'white' : 'black'
        }"
      >
        {{ getSeverityText(incident.severity) }}
      </span>
    </div>
    <div class="p-4 space-y-3">
      <h3 class="text-xl font-bold text-gray-900">{{ incident.name }}</h3>
      <div class="space-y-2">
        <p class="text-sm text-gray-600 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </p>
        <p class="text-sm text-gray-600 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ formattedLocation }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getColorForSeverity, getSeverityText } from '../utils/markerStyles';
import { formatDate, formatLocation } from '../utils/formatters';

const props = defineProps({
  incident: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit']);

const formattedDate = computed(() => formatDate(props.incident.datetime));
const formattedLocation = computed(() => formatLocation(props.incident.location));
</script>