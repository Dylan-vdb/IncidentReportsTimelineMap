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
  return new Date(datetime).toLocaleString();
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
        <div class="popup-content bg-white rounded-lg pt-4 pb-4 pl-4 max-w-sm">
          <div class="relative">
            <img src="${incident.image}" alt="${incident.name}" class="w-full h-48 object-cover rounded-t-lg">
            <span class="absolute top-2 right-2 px-3 py-1 text-sm font-medium rounded-full shadow-md" 
                  style="background-color: ${getColorForSeverity(incident.severity)}; color: ${incident.severity > 2 ? 'white' : 'black'}">
              ${severityText}
            </span>
          </div>
          <div class="p-3">
            <h3 class="text-lg font-semibold mb-2">${incident.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${formatDate(incident.datetime)}</p>
            <div class="text-sm text-gray-700">
              <p>Location: ${formatLocation(incident.location)}</p>
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

  // Initial features setup
  updateFeatures();

  // Watch for changes in incidents prop
  watch(() => props.incidents, () => {
    updateFeatures();
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
    props.map.removeOverlay(popup);
  }
});
</script>

<style>
/* Customize ol-ext popup styles */
.ol-popup {
  min-width: 200px;
  max-width: 400px;
}

.ol-popup .ol-popup-content {
  padding: 0;
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