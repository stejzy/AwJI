<template>
  <div class="container">
    <div class="dropdown d-flex justify-content-end mb-3">
      <input
        type="search"
        class="form-control me-2 custom-width"
        placeholder="Search products by name"
        v-model="searchQuery"
      />
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="categoryDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Select Category
      </button>
      <ul class="dropdown-menu" aria-labelledby="categoryDropdown">
        <li>
          <a class="dropdown-item" href="#" @click.prevent="selectCategory('')">
            All Categories
          </a>
        </li>
        <li v-for="category in categories" :key="category._id">
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
        <tr v-if="products.length === 0">
          <td colspan="6" class="text-center">No products available</td>
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

<script>
export default {
  name: "ProductsComponent",
  props: ["products", "categories"],
  data: function () {
    return {
      selectedCategory: "",
      searchQuery: "",
      tableHeaders: ["#", "Name", "Description", "Price", "Weight", "Category"],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const matchesCategory =
          !this.selectedCategory ||
          product.category._id === this.selectedCategory;
        const matchesSearchQuery = product.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        return matchesCategory && matchesSearchQuery;
      });
    },
  },
  methods: {
    selectCategory(categoryID) {
      this.selectedCategory = categoryID;
    },
  },
};
</script>

<style>
.custom-width {
  width: 20%;
}
</style>
