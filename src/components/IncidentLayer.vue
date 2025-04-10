<template>
  <!-- ol-ext popup will be managed by OpenLayers overlay -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill } from 'ol/style';
import 'ol-ext/dist/ol-ext.min.css';
import Popup from 'ol-ext/overlay/Popup';

const props = defineProps({
  map: {
    type: Object,
    required: true
  },
  incidents: {
    type: Array,
    required: true
  }
});

let vectorLayer;
let vectorSource;
let popup;

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
  const date = new Date(datetime);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

// Format location for display
const formatLocation = (location) => {
  return `${location[0].toFixed(4)}, ${location[1].toFixed(4)}`;
};

// Handle click events on markers
const handleMapClick = (event) => {
  const feature = props.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
  
  if (feature) {
    const incident = feature.get('incident');
    if (incident) {
      const coordinates = feature.getGeometry().getCoordinates();
      const severityText = {
        1: 'Low',
        2: 'Moderate',
        3: 'High',
        4: 'Severe',
        5: 'Critical'
      }[incident.severity] || 'Unknown';

      const content = `
        <div class="popup-content bg-white rounded-sm shadow-lg overflow-hidden max-w-sm transform transition-transform duration-200 hover:scale-[1.02]">
          <div class="relative">
            <img src="${incident.image}" alt="${incident.name}" class="w-full h-48 object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span class="absolute top-3 left-3 px-3 py-1.5 text-sm font-semibold rounded-full shadow-lg" 
                  style="background-color: ${getColorForSeverity(incident.severity)}; color: ${incident.severity > 2 ? 'white' : 'black'}">
              ${severityText}
            </span>
          </div>
          <div class="p-4 space-y-3">
            <h3 class="text-xl font-bold text-gray-900">${incident.name}</h3>
            <div class="space-y-2">
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                ${formatDate(incident.datetime)}
              </p>
              <p class="text-sm text-gray-600 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ${formatLocation(incident.location)}
              </p>
            </div>
          </div>
        </div>
      `;
      popup.show(coordinates, content);
    }
  } else if (!props.map.getInteractions().getArray().some(i => i.getActive() && i.get('type') === 'popup-closer')) {
    popup.hide();
  }
};

onMounted(() => {
  // Create popup overlay
  popup = new Popup({
    popupClass: 'default anim',
    closeBox: true,
    onclose: () => {
      // Optional: Add any cleanup code here
    }
  });
  props.map.addOverlay(popup);

  // Create vector source and layer
  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: vectorSource
  });

  // Function to update features based on incidents prop
  const updateFeatures = () => {
    vectorSource.clear();
    props.incidents.forEach(incident => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(incident.location))
      });
      feature.setStyle(createCircleStyle(incident));
      feature.set('incident', incident);
      vectorSource.addFeature(feature);
    });
  };

  updateFeatures();

  watch(() => props.incidents, () => {
    updateFeatures();
  });

  props.map.addLayer(vectorLayer);
  
  props.map.on('click', handleMapClick);
});

onUnmounted(() => {
  if (props.map) {
    props.map.removeLayer(vectorLayer);
    props.map.un('click', handleMapClick);
    props.map.removeOverlay(popup);
  }
});
</script>

<style>
/* Customize ol-ext popup styles */
.ol-popup {
  min-width: 200px;
  max-width: 400px;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
}

.ol-popup .ol-popup-content {
  padding: 0;
  /* border-radius: 0.5rem; */
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ol-popup.hasclosebox .ol-popup-content {
    margin-right: 0;
    padding: 5px;
}


.ol-popup .closeBox {
  right: 12px;
  left: auto;
  top: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  border: none;
  z-index: 10;
  position: absolute;
  cursor: pointer;
}

.ol-popup .closeBox:hover {
  background: rgba(0, 0, 0, 0.7) !important;
  transform: scale(1.1);
}

.ol-popup .closeBox:before {
  color: white !important;
  font-size: 24px !important;
  line-height: 1 !important;
  margin: 0 !important;
  position: static !important;
}

.ol-popup .closeBox:after {
    margin: -.55em 0;
}

.ol-popup.anim {
  transform-origin: bottom center;
  transition: transform 0.3s;
}

.ol-popup.anim.ol-popup-bottom {
  transform-origin: top center;
}

.ol-popup.anim.ol-popup-right {
  transform-origin: center left;
}

.ol-popup.anim.ol-popup-left {
  transform-origin: center right;
}
</style>