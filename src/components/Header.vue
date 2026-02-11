<template>
  <header class="text-blue-600">
    <div class="container mx-auto px-4 py-4 flex justify-center items-center">
      <div class="flex items-center space-x-2">
        <Zap class="w-8 h-8" />
        <h1 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-shadow">PWA检测工具</h1>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
</script>
