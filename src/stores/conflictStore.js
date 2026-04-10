import { defineStore } from 'pinia'

export const useConflictStore = defineStore('conflict', {
  state: () => ({
    conflicts: [],
    isLoading: false,
    error: null
  }),

  getters: {
    totalConflicts: (state) => state.conflicts.length
  },

  actions: {
    async fetchConflicts() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:8080/api/v1/conflicts');
        if (!response.ok) throw new Error('Error al conectar con la API');
        this.conflicts = await response.json();
      } catch (err) {
        this.error = "No se pudieron cargar los conflictos";
      } finally {
        this.isLoading = false;
      }
    },

    async deleteConflict(id) {
      if(!confirm('¿Seguro que quieres borrar este conflicto?')) return;

      try {
        const response = await fetch(`http://localhost:8080/api/v1/conflicts/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          this.conflicts = this.conflicts.filter(c => c.id !== id);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
})