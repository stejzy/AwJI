<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import axios from "axios";
import ProductCard from "./ProductCard.vue";

const selectedCategory = ref("");
const searchQuery = ref("");

const state = reactive({
  products: [],
  categories: [],
  isLoading: true,
});

onMounted(async () => {
  try {
    const response1 = await axios.get(`/api/products/`);
    state.products = response1.data.products;
    const response2 = await axios.get(`/api/categories/`);
    state.categories = response2.data.categories;
  } catch (error) {
    console.error("Error fetching jobs or categories.", error);
  } finally {
    state.isLoading = false;
  }
});

const filteredProducts = computed(() => {
  return state.products.filter((product) => {
    const matchesCategory =
        !selectedCategory.value || product.category._id === selectedCategory.value;
    const matchesSearchQuery = product.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    return matchesCategory && matchesSearchQuery;
  });
});

const selectCategory = (categoryID) => {
  selectedCategory.value = categoryID;
};
</script>

<template>
  <template v-if="state.isLoading">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
  </template>
  <template v-else>
    <div class="container custom-container">
      <h2>Lista produktów</h2>
      <div class="dropdown d-flex justify-content-end mb-3">
        <input
            type="search"
            class="form-control me-2"
            placeholder="Wyszukaj po nazwie produktu"
            v-model="searchQuery"
        />
        <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="categoryDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
          Wybierz kategorię
        </button>
        <ul class="dropdown-menu" aria-labelledby="categoryDropdown">
          <li>
            <a class="dropdown-item" href="#" @click.prevent="selectCategory('')">
              Wszystkie kategorie
            </a>
          </li>
          <li v-for="category in state.categories" :key="category._id">
            <a
                class="dropdown-item"
                href="#"
                @click.prevent="selectCategory(category._id)"
            >
              {{ category.name }}
            </a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div v-if="filteredProducts.length === 0" class="col-12 text-center">
          Brak produktów
        </div>
        <div
            v-else
            v-for="product in filteredProducts"
            :key="product._id"
            class="col-12 col-md-4 mb-4"
        >
          <ProductCard :product="product" :categories="state.categories" />
        </div>
      </div>
    </div>
  </template>
</template>

<style>

</style>