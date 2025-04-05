<template>
  <div class="map-container w-full h-[calc(100vh-3rem)]">
    <div ref="mapRef" class="map w-full h-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

// Eastern Cape approximate coordinates
const EASTERN_CAPE_CENTER = fromLonLat([26.419389, -32.296382]);
const mapRef = ref(null);
let map;

onMounted(() => {
  // Initialize OpenLayers map
  map = new Map({
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
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
   /* height: 100vh; */
  display: flex;
}

.map {
  background: #f8f9fa;
  /* position: absolute; */
  /* top: 0;
  left: 0;
  right: 0;
  bottom: 0; */
  width: 100%;
  height: 100%;
}
</style>