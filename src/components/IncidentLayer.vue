<template>
  <div class="incident-popup" v-if="selectedIncident" :style="popupStyle">
    <div class="popup-content bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <button @click="closePopup" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <img :src="selectedIncident.image" :alt="selectedIncident.name" class="w-full h-40 object-cover rounded-lg mb-3">
      <h3 class="text-lg font-semibold mb-2">{{ selectedIncident.name }}</h3>
      <p class="text-sm text-gray-600 mb-2">{{ formatDate(selectedIncident.datetime) }}</p>
      <div class="text-sm text-gray-700">
        <p>Location: {{ formatLocation(selectedIncident.location) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill } from 'ol/style';
import incidents from '../data/incidents';

const props = defineProps({
  map: {
    type: Object,
    required: true
  }
});

const selectedIncident = ref(null);
const popupStyle = ref({});
let vectorLayer;
let vectorSource;

// Create a function to interpolate color between yellow and red based on severity
const getColorForSeverity = (severity) => {
  // Ensure severity is a number between 1 and 5
  const validSeverity = Math.max(1, Math.min(5, Number(severity) || 1));
  // Convert severity (1-5) to a value between 0 and 1
  const t = (validSeverity - 1) / 4;
  // RGB values for yellow (255, 255, 0) to red (255, 0, 0)
  const r = 255;
  const g = Math.round(255 * (1 - t));
  const b = 0;
  return `rgb(${r}, ${g}, ${b})`;
};

// Create circle style based on incident severity
const createCircleStyle = (incident) => {
  return new Style({
    image: new Circle({
      radius: 8, // Fixed size for all incidents
      fill: new Fill({
        color: getColorForSeverity(incident.severity)
      })
    })
  });
};

// Format date for display
const formatDate = (datetime) => {
  return new Date(datetime).toLocaleString();
};

// Format location for display
const formatLocation = (location) => {
  return `${location[0].toFixed(4)}, ${location[1].toFixed(4)}`;
};

// Close popup
const closePopup = () => {
  selectedIncident.value = null;
};

// Handle click events on markers
const handleMapClick = (event) => {
  const feature = props.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
  
  if (feature) {
    const incident = feature.get('incident');
    if (incident) {
      selectedIncident.value = incident;
      const coordinates = feature.getGeometry().getCoordinates();
      const pixel = props.map.getPixelFromCoordinate(coordinates);
      
      popupStyle.value = {
        position: 'absolute',
        left: `${pixel[0]}px`,
        top: `${pixel[1] - 10}px`,
        transform: 'translate(-50%, -100%)'
      };
    }
  } else {
    selectedIncident.value = null;
  }
};

onMounted(() => {
  // Create vector source and layer
  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: vectorSource
  });

  // Add features for each incident
  incidents.forEach(incident => {
    const feature = new Feature({
      geometry: new Point(fromLonLat(incident.location))
    });
    feature.setStyle(createCircleStyle(incident));
    feature.set('incident', incident);
    vectorSource.addFeature(feature);
  });

  // Add layer to map
  props.map.addLayer(vectorLayer);
  
  // Add click handler
  props.map.on('click', handleMapClick);
});

onUnmounted(() => {
  if (props.map) {
    props.map.removeLayer(vectorLayer);
    props.map.un('click', handleMapClick);
  }
});
</script>

<style scoped>
.incident-popup {
  z-index: 1000;
}

.popup-content {
  min-width: 200px;
}
</style>