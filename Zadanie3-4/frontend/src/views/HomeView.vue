<script setup>
import {computed} from "vue";
  import { useAuthStore } from '@/stores/auth';
  import ProductsComponent from '@/components/ProductsComponent.vue'

  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div v-if="isAuthenticated" class="text-center">
      <ProductsComponent />
    </div>

    <div v-else class="text-center bg-light p-4 border rounded shadow">
      <h1 class="text-secondary">Zaloguj się, żeby uzyskać dostęp!</h1>
    </div>
  </div>
</template>

<style scoped>

</style>