<script setup>
import {computed} from "vue";
  import { useAuthStore } from '@/stores/auth';
  import ProductsComponent from '@/components/ProductsComponent.vue'

  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center">
      <ProductsComponent />
  </div>
</template>

<style scoped>

</style>