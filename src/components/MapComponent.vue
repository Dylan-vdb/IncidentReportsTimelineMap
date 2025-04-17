<template>
  <div class="map-container w-full h-[calc(100vh-3rem)]">
    <div ref="mapRef" class="map w-full h-full"></div>
    <IncidentLayer :map="map" :incidents="incidents" v-if="map" />
    <div v-if="isSelectingLocation" class="crosshair-container">
      <img src="../assets/crosshair.svg" class="crosshair" alt="crosshair" />
      <div class="coordinates-display">
        {{ formatCoordinates(currentCenter) }}
      </div>
      <button
        @click="confirmLocation"
        class="fire-button px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
      >
        Fire
      </button>
    </div>
    <div v-if="showCrossMarker" class="cross-marker">
      <img src="../assets/crosshair.svg" class="cross" alt="cross marker" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useTimeout } from '@vueuse/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import IncidentLayer from './IncidentLayer.vue';
import { useMapStore } from '../stores/mapState';
import { debounce } from 'perfect-debounce';

// Define props
const props = defineProps({
  incidents: {
    type: Array,
    required: true
  }
});

// Eastern Cape approximate coordinates
const EASTERN_CAPE_CENTER = fromLonLat([26.419389, -32.296382]);
const mapRef = ref(null);
const map = ref(null);
const mapStore = useMapStore();
const isSelectingLocation = computed(() => mapStore.isSelectingLocation);
const currentCenter = ref([0, 0]);
const showCrossMarker = ref(false);

const formatCoordinates = (coords) => {
  return `${coords[0].toFixed(6)}°, ${coords[1].toFixed(6)}°`;
};

const updateMapCenter = debounce(async () => {
  if (!map.value || !isSelectingLocation.value) return;
  
  const view = map.value.getView();
  const center = view.getCenter();
  const lonLat = toLonLat(center);
  currentCenter.value = lonLat;
  mapStore.setCenter(lonLat);
}, 300); // 100ms debounce delay

const confirmLocation = () => {
  const coordinates = currentCenter.value;
  // First update the center coordinates
  mapStore.setCenter(coordinates);
  // Show cross marker
  showCrossMarker.value = true;
  // Hide after 2 seconds
  setTimeout(() => {
    showCrossMarker.value = false;
  }, 500);
  // Use nextTick to ensure the store update has propagated
  nextTick(() => {
    mapStore.setSelectingLocation(false);
  });
};

onMounted(() => {
  // Initialize OpenLayers map
  map.value = new Map({
    target: mapRef.value,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: EASTERN_CAPE_CENTER,
      zoom: 7
    })
  });

  // Add event listeners for map movement
  map.value.on('moveend', updateMapCenter);
  updateMapCenter();
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
  display: flex;
}

.map {
  background: #f8f9fa;
  width: 100%;
  height: 100%;
}

.crosshair-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.crosshair {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 1px #000);
}

.coordinates-display {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-family: monospace;
}

.fire-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50px);
  transition: all 0.2s ease;
  pointer-events: auto;
}

.cross-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

.cross {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.8));
  animation: pulse 2s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>