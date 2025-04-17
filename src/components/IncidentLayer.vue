<template>
  <div>
    <!-- ol-ext popup will be managed by OpenLayers overlay -->
    <IncidentForm
      :is-open="showEditForm"
      :incident-to-edit="selectedIncident"
      @close="handleFormClose"
      @submit="handleFormClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, h, render, computed } from 'vue';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import 'ol-ext/dist/ol-ext.min.css';
import Popup from 'ol-ext/overlay/Popup';
import IncidentForm from './IncidentForm.vue';
import IncidentPopup from './IncidentPopup.vue';
import { useIncidentsStore } from '../stores/incidents';
import { createCircleStyle } from '../utils/markerStyles';
import '../styles/popup.css';

const store = useIncidentsStore();
const showEditForm = ref(false);
const selectedIncident = ref(null);

const props = defineProps({
  map: {
    type: Object,
    required: true
  }
});

const filteredIncidents = computed(() => store.getFilteredIncidents);

let vectorLayer;
let vectorSource;
let popup;

const handleFormClose = () => {
  const incident = selectedIncident.value;
  showEditForm.value = false;
  
  if (incident) {
    // Find the feature for the edited incident
    const feature = vectorSource.getFeatures().find(f => f.get('incident').id === incident.id);
    if (feature) {
      const coordinates = feature.getGeometry().getCoordinates();
      const container = document.createElement('div');
      const vnode = h(IncidentPopup, {
        incident,
        onEdit: handleEditClick
      });
      render(vnode, container);
      popup.show(coordinates, container);
    }
  }
  
  selectedIncident.value = null;
};

const handleEditClick = (incidentId) => {
  selectedIncident.value = store.getIncidentById(incidentId);
  showEditForm.value = true;
};

const handleMapClick = (event) => {
  const feature = props.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
  
  if (feature) {
    const incident = feature.get('incident');
    if (incident) {
      const coordinates = feature.getGeometry().getCoordinates();
      const container = document.createElement('div');
      const vnode = h(IncidentPopup, {
        incident,
        onEdit: handleEditClick
      });
      render(vnode, container);
      popup.show(coordinates, container);
    }
  } else if (!props.map.getInteractions().getArray().some(i => i.getActive() && i.get('type') === 'popup-closer')) {
    popup.hide();
  }
};

onMounted(() => {
  popup = new Popup({
    popupClass: 'default anim',
    closeBox: true,
    onclose: () => {
      // Optional: Add any cleanup code here
    }
  });
  props.map.addOverlay(popup);

  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer({
    source: vectorSource
  });

  const updateFeatures = () => {
    vectorSource.clear();
    filteredIncidents.value.forEach(incident => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(incident.location))
      });
      feature.setStyle(createCircleStyle(incident));
      feature.set('incident', incident);
      vectorSource.addFeature(feature);
    });
  };

  updateFeatures();

  watch(filteredIncidents, () => {
    updateFeatures();
  }, { deep: true });

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