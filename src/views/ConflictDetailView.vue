<template>
  <main>
    <button
      @click="$router.push('/')"
      class="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
    >
      ← Volver al listado
    </button>

    <div v-if="store.isLoading" class="text-center py-10">
      Cargando detalles...
    </div>

    <article
      v-else-if="conflict"
      class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <header class="p-8 border-b border-gray-100 bg-slate-50">
        <span
          class="inline-block px-3 py-1 rounded-full text-sm font-bold text-white mb-4 shadow-sm"
          :class="{
            'bg-red-500': conflict.status === 'ACTIVE',
            'bg-blue-500': conflict.status === 'FROZEN',
            'bg-green-500': conflict.status === 'ENDED',
          }"
        >
          {{ conflict.status }}
        </span>
        <h1 class="text-4xl font-extrabold text-gray-900">
          {{ conflict.name }}
        </h1>
      </header>

      <div
        class="grid grid-cols-1 md:grid-cols-2 p-8 gap-6 bg-white border-b border-gray-100"
      >
        <div>
          <h3
            class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-1"
          >
            Fecha de Inicio
          </h3>
          <p class="text-lg font-medium text-gray-800">{{ formattedDate }}</p>
        </div>
        <div>
          <h3
            class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-1"
          >
            Países Implicados
          </h3>
          <p class="text-lg font-medium text-gray-800">
            {{
              conflict.countryNames?.length
                ? conflict.countryNames.join(", ")
                : "No especificados"
            }}
          </p>
        </div>
      </div>

      <div class="p-8 bg-white">
        <h3
          class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3"
        >
          Contexto e Información
        </h3>
        <p class="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
          {{
            conflict.description ||
            "No hay descripción disponible para este conflicto."
          }}
        </p>
      </div>
    </article>

    <div v-else class="text-center py-10 text-red-500 font-bold">
      No se ha encontrado el conflicto.
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useConflictStore } from "@/stores/conflictStore";

const route = useRoute();
const store = useConflictStore();

const conflict = computed(() => {
  const id = Number(route.params.id);
  return store.conflicts.find((c) => c.id === id);
});

const formattedDate = computed(() => {
  if (!conflict.value?.startDate) return "Desconocida";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(conflict.value.startDate).toLocaleDateString(
    "es-ES",
    options,
  );
});

onMounted(() => {
  if (store.conflicts.length === 0) {
    store.fetchConflicts();
  }
});
</script>
