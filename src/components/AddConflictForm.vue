<template>
  <div class="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
    <h2 class="text-lg font-bold mb-4 text-gray-800">➕ Añadir Nuevo Conflicto</h2>
    
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre del Conflicto</label>
        <input v-model="formData.name" type="text" required 
               class="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
               placeholder="Ej: Crisis de octubre">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea v-model="formData.description" required rows="2"
                  class="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Breve resumen del conflicto..."></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Países Implicados (separados por coma)</label>
          <input v-model="countriesInput" type="text" required
                 class="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                 placeholder="Ej: España, Francia">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado</label>
          <select v-model="formData.status" class="mt-1 w-full p-2 border rounded bg-white">
            <option value="ACTIVE">Activo</option>
            <option value="FROZEN">Congelado</option>
            <option value="ENDED">Finalizado</option>
          </select>
        </div>
      </div>

      <button type="submit" 
              class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
              :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : 'Guardar Conflicto' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useConflictStore } from '@/stores/conflictStore'; // Asegúrate de que esta ruta coincida con tu proyecto

const store = useConflictStore();

const isSubmitting = ref(false);
const countriesInput = ref('');
const formData = ref({
  name: '',
  description: '',
  status: 'ACTIVE',
  startDate: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
  countryNames: []
});

const submitForm = async () => {
  isSubmitting.value = true;
  
  // Convertimos el string de países en un array limpio
  formData.value.countryNames = countriesInput.value.split(',').map(c => c.trim());
  
  const success = await store.addConflict(formData.value);
  
  if (success) {
    // Limpiamos el formulario si ha ido bien
    formData.value.name = '';
    formData.value.description = '';
    formData.value.status = 'ACTIVE';
    countriesInput.value = '';
    alert('¡Conflicto guardado en Supabase con éxito!');
  } else {
    alert('Hubo un error al guardar.');
  }
  
  isSubmitting.value = false;
};
</script>