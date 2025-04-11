<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                v-model="form.time"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div class="grid grid-cols-2 gap-4">
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
          </div>

          <div>
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

          <div>
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
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useIncidentsStore } from '../stores/incidents';

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
  form.value = {
    name: '',
    date: '',
    time: '',
    location: [0, 0],
    severity: 1,
    image: ''
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