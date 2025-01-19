<template>
  <router-view></router-view>
</template>

<script>
import axios from "axios";

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

        // Zaktualizuj trasę "/products" w routerze
        this.$router.options.routes.forEach((route) => {
          if (route.path === "/") {
            route.children.forEach((childRoute) => {
              if (childRoute.path === "products") {
                childRoute.meta.products = productsResponse.data.products;
                childRoute.meta.categories = categoriesResponse.data.categories;
              }
            });
          }
        });

        // Zapisz dane do lokalnych zmiennych (opcjonalnie)
        this.products = productsResponse.data.products;
        this.categories = categoriesResponse.data.categories;
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    },
  },
};
</script>
