import { defineStore } from 'pinia';

export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    allIncidents: [],
    filteredIncidents: [],
    currentDateRange: {
      start: null,
      end: null
    }
  }),

  actions: {
    setIncidents(incidents) {
      this.allIncidents = incidents;
      this.filteredIncidents = incidents;
    },

    filterByDateRange(start, end) {
      this.currentDateRange = { start, end };
      this.filteredIncidents = this.allIncidents.filter(incident => {
        const incidentDate = new Date(incident.datetime);
        return incidentDate >= start && incidentDate <= end;
      });
    },

    // Prepare for future server integration
    async fetchIncidents() {
      // TODO: Replace with actual API call
      return this.allIncidents;
    },

    async addIncident(incident) {
      // TODO: Implement API call
      this.allIncidents.push(incident);
      // Re-apply current filter if exists
      if (this.currentDateRange.start && this.currentDateRange.end) {
        this.filterByDateRange(this.currentDateRange.start, this.currentDateRange.end);
      } else {
        this.filteredIncidents = this.allIncidents;
      }
    },

    async updateIncident(id, updatedIncident) {
      // TODO: Implement API call
      const index = this.allIncidents.findIndex(inc => inc.id === id);
      if (index !== -1) {
        this.allIncidents[index] = { ...this.allIncidents[index], ...updatedIncident };
        // Re-apply current filter if exists
        if (this.currentDateRange.start && this.currentDateRange.end) {
          const start = new Date(this.currentDateRange.start);
          const end = new Date(this.currentDateRange.end);
          this.filteredIncidents = this.allIncidents.filter(incident => {
            const incidentDate = new Date(incident.datetime);
            return incidentDate >= start && incidentDate <= end;
          });
        } else {
          this.filteredIncidents = [...this.allIncidents];
        }
    }
    }
  },

  getters: {
    getFilteredIncidents: (state) => state.filteredIncidents,
    getAllIncidents: (state) => state.allIncidents,
    getIncidentById: (state) => (id) => state.allIncidents.find(inc => inc.id === id)
  }
});