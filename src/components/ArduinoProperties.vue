<script setup>
import { ref, onMounted } from 'vue';
import { getThings } from '@/services/arduinoService';

const things = ref([]);

onMounted(async () => {
  try {
    things.value = await getThings();
    console.log('Things:', things.value);
  } catch (error) {
    console.error('Error al cargar las Things:', error);
  }
});
</script>

<template>
  <div>
    <h1>Arduino Things</h1>
    <ul>
      <li v-for="thing in things" :key="thing.last_value">
        {{ thing.name }} (ID: {{ thing.last_value }})
      </li>
    </ul>
  </div>
</template>
