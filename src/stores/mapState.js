import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
  state: () => ({
    isSelectingLocation: false,
    center: [0, 0],
    zoom: 2
  }),

  actions: {
    setSelectingLocation(value) {
      this.isSelectingLocation = value;
    },
    setCenter(center) {
      this.center = center;
    },
    setZoom(zoom) {
      this.zoom = zoom;
    }
  }
});