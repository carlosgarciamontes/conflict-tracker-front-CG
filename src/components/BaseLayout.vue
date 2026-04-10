<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <header class="bg-slate-900 text-white shadow-md">
      <div
        class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold tracking-wider">🌍 Conflict Tracker</h1>
        <nav>
          <RouterLink to="/" class="text-slate-300 hover:text-white transition"
            >Inicio</RouterLink
          >
        </nav>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-6 py-8">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
