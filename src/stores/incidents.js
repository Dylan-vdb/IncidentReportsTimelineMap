import { defineStore } from 'pinia';

export const useIncidentsStore = defineStore('incidents', {
  state: () => ({
    allIncidents: [],
    filteredIncidents: []
  }),

  actions: {
    setIncidents(incidents) {
      this.allIncidents = incidents;
      this.filteredIncidents = incidents;
    },

    filterByDateRange(start, end) {
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
      // Re-apply current filter by finding the date range from existing filtered incidents
      if (this.filteredIncidents.length > 0) {
        const start = new Date(Math.min(...this.filteredIncidents.map(inc => new Date(inc.datetime))));
        const end = new Date(Math.max(...this.filteredIncidents.map(inc => new Date(inc.datetime))));
        this.filterByDateRange(start, end);
      } else {
        this.filteredIncidents = this.allIncidents;
      }
    },

    async updateIncident(id, updatedIncident) {
      // TODO: Implement API call
      const index = this.allIncidents.findIndex(inc => inc.id === id);
      if (index !== -1) {
        this.allIncidents[index] = { ...this.allIncidents[index], ...updatedIncident };
        this.filteredIncidents = [...this.allIncidents];
      }
    }
  },

  getters: {
    getFilteredIncidents: (state) => state.filteredIncidents,
    getAllIncidents: (state) => state.allIncidents,
    getIncidentById: (state) => (id) => state.allIncidents.find(inc => inc.id === id)
  }
});