<template>
  <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
    <h2 class="text-lg font-bold mb-4 text-gray-800">➕ Añadir Nuevo Conflicto</h2>
    
    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre del Conflicto *</label>
          <input v-model="formData.name" type="text" required 
                 class="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                 placeholder="Ej: Crisis de octubre">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Inicio *</label>
          <input v-model="formData.startDate" type="date" required
                 class="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea v-model="formData.description" rows="3"
                  class="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contexto y resumen del conflicto..."></textarea>
      </div>

      <div class="w-full md:w-1/2">
        <label class="block text-sm font-medium text-gray-700">Estado *</label>
        <select v-model="formData.status" class="mt-1 w-full p-2 border border-gray-300 rounded bg-white focus:ring-blue-500 focus:border-blue-500">
          <option value="ACTIVE">Activo</option>
          <option value="FROZEN">Congelado</option>
          <option value="ENDED">Finalizado</option>
        </select>
      </div>

      <div class="flex gap-3 pt-4 border-t mt-6">
        <button type="submit" 
                class="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando en BD...' : 'Guardar Conflicto' }}
        </button>
        <button type="button" @click="$emit('success')"
                class="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 transition">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useConflictStore } from '@/stores/conflictStore';

const emit = defineEmits(['success']);
const store = useConflictStore();
const isSubmitting = ref(false);


const formData = ref({
  name: '',
  startDate: new Date().toISOString().split('T')[0], 
  status: 'ACTIVE',
  description: '',
  countries: [], 
  factions: [],
  events: []
});

const submitForm = async () => {
  isSubmitting.value = true;
  
  const payload = { ...formData.value };
  
  const success = await store.addConflict(payload);
  
  if (success) {
   
    formData.value.name = '';
    formData.value.description = '';
    formData.value.status = 'ACTIVE';
    formData.value.startDate = new Date().toISOString().split('T')[0];
    
    alert('¡Conflicto guardado correctamente!');
    emit('success'); // Avisa al componente padre (HomeView) para que oculte el formulario
  } else {
    alert('Error al guardar. Revisa la consola o los logs de Render.');
  }
  
  isSubmitting.value = false;
};
</script>