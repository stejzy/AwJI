<script setup>
import {ref, computed, onMounted, reactive} from "vue";
import axios from "axios";
const selectedCategory = ref("");
const searchQuery = ref("");
const tableHeaders = ["#", "Nazwa", "Opis", "Cena", "Waga", "Kategoria"];

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
    console.log("Error fetching jobs or categories.", error);
  } finally {
    state.isLoading = false;
  }
})

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
  <div class="container">
    <div class="dropdown d-flex justify-content-end mb-3">
      <input
        type="search"
        class="form-control me-2 custom-width"
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

    <table class="table">
      <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="state.products.length === 0">
          <td colspan="6" class="text-center">Brak produktów</td>
        </tr>
        <tr v-else v-for="(product, index) in filteredProducts" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.unitPrice }}</td>
          <td>{{ product.unitWeight }}</td>
          <td>{{ product.category.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.custom-width {
  width: 20%;
}
</style>
