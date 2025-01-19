<template>
  <router-view ></router-view>
  <router-view name="Products" :products="products" :categories="categories"></router-view>
</template>

<script>
import axios from "axios";
import NavbarComponent from "./components/NavbarComponent.vue";

export default {
  name: "App",
  data: function () {
    return {
      products: [],
      categories: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const productsResponse = await axios.get(
          "http://localhost:3000/products"
        );
        const categoriesResponse = await axios.get(
          "http://localhost:3000/categories"
        );

        this.products = productsResponse.data.products;
        this.categories = categoriesResponse.data.categories;
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    },
  },
};
</script>
