<template>
  <div v-if="isOpen" :style="isSelectingLocation ? `pointer-events: none;` : `pointer-events: auto`" class="fixed right-0 top-0 z-50 p-4">
    <div>
      <div :class="['bg-white rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-y-auto transition-transform duration-300', { 'translate-x-[calc(100vw-520px)]': isSelectingLocation }]">
        <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">{{ isEditing ? 'Edit Incident' : 'Add New Incident' }}</h2>
          <button @click="close" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div style="pointer-events: auto;">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div style="pointer-events: auto;">
              <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                v-model="form.time"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div style="pointer-events: auto;">
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div class="grid grid-cols-2 gap-4 mb-2">
              <input
                v-model.number="form.location[0]"
                type="number"
                step="0.0001"
                placeholder="Longitude"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model.number="form.location[1]"
                type="number"
                step="0.0001"
                placeholder="Latitude"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              @click="toggleLocationSelect"
              class="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Select on Map
            </button>
          </div>

          <div style="pointer-events: auto;">
            <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              v-model="form.severity"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Low</option>
              <option value="2">Moderate</option>
              <option value="3">High</option>
              <option value="4">Severe</option>
              <option value="5">Critical</option>
            </select>
          </div>

          <div style="pointer-events: auto;">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              v-model="form.image"
              type="url"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end gap-4 pt-4">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {{ isEditing ? 'Update' : 'Add' }} Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useIncidentsStore } from '../stores/incidents';
import { useMapStore } from '../stores/mapState';

const mapStore = useMapStore();
const isSelectingLocation = computed(() => mapStore.isSelectingLocation);

// Watch for changes in map center when selecting location
watch(
  () => mapStore.center,
  (newCenter) => {
    if (isSelectingLocation.value) {
      form.value.location = [...newCenter].map(coord => {
        return parseFloat(coord.toFixed(4));
      }); // Create new array reference for reactivity
    }
  }
);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  incidentToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);
const store = useIncidentsStore();

const isEditing = computed(() => !!props.incidentToEdit);

const form = ref(null);

const resetForm = () => {
  const now = new Date();
  const randomIncidentNames = [
    "Unexpected System Outage",
    "Network Connectivity Issue",
    "Security Alert",
    "Database Performance Degradation",
    "Application Error"
  ];
  const randomName = randomIncidentNames[Math.floor(Math.random() * randomIncidentNames.length)];
  
  form.value = {
    name: randomName,
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0].slice(0, 5),
    location: [0, 0],
    severity: 2, // Medium severity
    image: 'https://picsum.photos/800/600' // Random placeholder image
  };
};

// Initialize the form
resetForm();

watch(() => props.incidentToEdit, (newVal) => {
  if (newVal) {
    const datetime = new Date(newVal.datetime);
    form.value = {
      name: newVal.name,
      date: datetime.toISOString().split('T')[0],
      time: datetime.toTimeString().split(' ')[0].slice(0, 5),
      location: [...newVal.location],
      severity: newVal.severity,
      image: newVal.image
    };
  } else {
    resetForm();
  }
}, { immediate: true });

const close = () => {
  emit('close');
  resetForm();
  isSelectingLocation.value = false;
};

const toggleLocationSelect = () => {
  mapStore.setSelectingLocation(!mapStore.isSelectingLocation);
};

const handleSubmit = async () => {
  const datetime = `${form.value.date}T${form.value.time}:00`;
  const incidentData = {
    name: form.value.name,
    datetime,
    location: form.value.location,
    severity: Number(form.value.severity),
    image: form.value.image
  };

  if (isEditing.value) {
    await store.updateIncident(props.incidentToEdit.id, incidentData);
  } else {
    // Generate a new ID (in a real app, this would be handled by the backend)
    incidentData.id = Math.max(...store.getAllIncidents.map(inc => inc.id)) + 1;
    await store.addIncident(incidentData);
  }

  emit('submit');
  close();
};
</script>