import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "./components/LoginComponent.vue";
import RegisterComponent from "./components/RegisterComponent.vue";
import ProductsComponent from "./components/ProductsComponent.vue";
import EloComponent from "./components/EloComponent.vue";
import PagesComponent from "./components/PagesComponent.vue";
import NavbarComponent from "./components/NavbarComponent.vue";

const routes = [
  { path: "/login", component: LoginComponent },
  { path: "/register", component: RegisterComponent },
  {
    path: "/",
    components: {
      default: NavbarComponent,
      Products: ProductsComponent,
    },
    props: {
      Products: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
