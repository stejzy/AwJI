import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "./components/LoginComponent.vue";
import RegisterComponent from "./components/RegisterComponent.vue";
import ProductsComponent from "./components/ProductsComponent.vue";
import EloComponent from "./components/EloComponent.vue";
import PagesComponent from "./components/PagesComponent.vue";

const routes = [
  { path: "/login", component: LoginComponent },
  { path: "/register", component: RegisterComponent },
  {
    path: "/",
    component: PagesComponent,
    children: [
      {
        path: "products",
        component: ProductsComponent,
        props: (route) => ({
          products: route.meta.products,
          categories: route.meta.categories,
        }),
        meta: {
          products: [],
          categories: [],
        },
      },
      { path: "elo", component: EloComponent },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
