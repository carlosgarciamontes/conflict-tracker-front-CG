<template>
  <main class="max-w-7xl mx-auto p-6 min-h-screen">
    <header
      class="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b pb-6"
    >
      <div>
        <h1
          class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800"
        >
          Monitor de Conflictos
        </h1>
        <p class="text-gray-500 mt-2 font-medium">
          Explorando
          <span class="font-bold text-gray-800">{{
            store.totalConflicts
          }}</span>
          conflictos registrados
        </p>
      </div>

      <div class="flex flex-col gap-3 w-full md:w-auto">
        <button 
          @click="showAddForm = !showAddForm"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          {{ showAddForm ? '❌ Cerrar Formulario' : '➕ Añadir Conflicto' }}
        </button>

        <div class="relative w-full md:w-96">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar país o conflicto..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedStatus = ''"
            :class="
              selectedStatus === ''
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            "
            class="px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            Todos
          </button>
          <button
            @click="selectedStatus = 'ACTIVE'"
            :class="
              selectedStatus === 'ACTIVE'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            "
            class="px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            🔥 Activos
          </button>
          <button
            @click="selectedStatus = 'FROZEN'"
            :class="
              selectedStatus === 'FROZEN'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            "
            class="px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            ❄️ Congelados
          </button>
          <button
            @click="selectedStatus = 'ENDED'"
            :class="
              selectedStatus === 'ENDED'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            "
            class="px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            🕊️ Finalizados
          </button>
        </div>
      </div>
    </header>

    <transition name="fade">
      <div v-if="showAddForm" class="mb-10">
        <AddConflictForm @success="showAddForm = false" />
      </div>
    </transition>

    <div v-if="store.isLoading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <div
      v-else-if="store.error"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm text-center"
    >
      <p class="font-bold text-lg mb-1">¡Vaya!</p>
      <p>{{ store.error }}</p>
    </div>

    <div v-else>
      <div v-if="filteredConflicts.length === 0" class="text-center py-20">
        <p class="text-xl font-medium text-gray-500">
          No hay coincidencias para "{{ searchQuery }}"
        </p>
        <button
          @click="resetFilters"
          class="mt-4 text-blue-500 hover:underline"
        >
          Limpiar filtros
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ConflictCard
          v-for="conflict in filteredConflicts"
          :key="conflict.id"
          :conflict="conflict"
          @delete="store.deleteConflict"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useConflictStore } from "@/stores/conflictStore";
import ConflictCard from "@/components/ConflictCard.vue";
import AddConflictForm from "@/components/AddConflictForm.vue"; // 1. Importar el formulario

const store = useConflictStore();

const searchQuery = ref("");
const selectedStatus = ref("");
const showAddForm = ref(false); // 2. Ref para controlar la visibilidad

const filteredConflicts = computed(() => {
  return store.conflicts.filter((conflict) => {
    const query = searchQuery.value.toLowerCase();
    const matchName = conflict.name.toLowerCase().includes(query);
    const matchCountry = conflict.countryNames
      ? conflict.countryNames.some((country) =>
          country.toLowerCase().includes(query),
        )
      : false;
    const passesTextFilter = matchName || matchCountry;

    const passesStatusFilter =
      selectedStatus.value === "" || conflict.status === selectedStatus.value;

    return passesTextFilter && passesStatusFilter;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "";
};

onMounted(() => {
  store.fetchConflicts();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>