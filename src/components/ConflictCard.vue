<template>
  <article
    class="bg-white rounded-lg shadow-md p-5 border-t-4 transition hover:shadow-lg flex flex-col h-full"
    :class="{
      'border-red-500': conflict.status === 'ACTIVE',
      'border-blue-500': conflict.status === 'FROZEN',
      'border-green-500': conflict.status === 'ENDED',
    }"
  >
    <div class="flex justify-between items-start mb-3">
      <RouterLink :to="'/conflicts/' + conflict.id" class="hover:underline">
        <h2 class="text-xl font-bold text-gray-800">{{ conflict.name }}</h2>
      </RouterLink>
      <span
        class="text-xs font-bold px-2 py-1 rounded-full text-white"
        :class="{
          'bg-red-500': conflict.status === 'ACTIVE',
          'bg-blue-500': conflict.status === 'FROZEN',
          'bg-green-500': conflict.status === 'ENDED',
        }"
      >
        {{ conflict.status }}
      </span>
    </div>

    <p class="text-sm text-gray-500 mb-3 font-medium">
      🗓️ Inicio: {{ conflict.startDate }}
    </p>
    <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
      {{ conflict.description }}
    </p>

    <div class="mt-auto pt-4 border-t flex justify-between items-center">
      <div class="flex flex-wrap gap-2 w-2/3">
        <div
          v-for="country in conflict.countryNames"
          :key="country"
          class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-100"
        >
          <img
            :src="getFlagUrl(country)"
            :alt="country"
            class="w-4 h-3 object-cover shadow-sm"
            @error="handleFlagError"
          />
          <span class="text-[10px] font-bold text-gray-600 uppercase">{{
            country
          }}</span>
        </div>
        <span
          v-if="!conflict.countryNames || conflict.countryNames.length === 0"
          class="text-xs text-gray-400"
        >
          📍 Desconocido
        </span>
      </div>

      <button
        @click="$emit('delete', conflict.id)"
        class="text-red-500 text-sm font-bold hover:text-red-700 transition"
      >
        Eliminar
      </button>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  conflict: {
    type: Object,
    required: true,
  },
});

defineEmits(["delete"]);

const getFlagUrl = (countryName) => {
  const codes = {
    España: "es",
    Rusia: "ru",
    Ucrania: "ua",
    Israel: "il",
    Palestina: "ps",
    EEUU: "us",
    USA: "us",
    Francia: "fr",
    Alemania: "de",
  };

  const code = codes[countryName] || "un";
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};

const handleFlagError = (e) => {
  e.target.style.display = "none";
};
</script>
