<script setup>
  import {RouterLink, useRoute} from "vue-router";
  import {useAuthStore} from "@/stores/auth.js";
  import {useCartStore} from "@/stores/cart.js";
  import {computed} from "vue";
  import router from "@/router/routes.js";

  const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
  }

  const authStore = useAuthStore();
  const cartStore = useCartStore();

  const isLoggedIn = computed(() => {
    return authStore.isAuthenticated;
  });

  const cartItemsQuantity = computed(() => {
    return cartStore.totalQuantity;
  })

  const logout = () => {
    authStore.logout();
    router.push('/');
  }
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">AWJI</RouterLink>
      <div class="d-flex align-items-center">
        <RouterLink
            to="/cart"
            class="nav-link me-4 d-lg-none"
            :class="{ active: isActiveLink('/cart') }"
        >
          <i class="pi pi-shopping-cart fs-4"></i>
          <span
              class="badge bg-danger text-white position-absolute translate-middle rounded-pill"
          >
            {{ authStore.isAuthenticated ? cartItemsQuantity : 0 }}
          </span>
        </RouterLink>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink
                class="nav-link"
                :class="{ active: isActiveLink('/') }"
                to="/"
            >
              Produkty
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
                class="nav-link"
                :class="{ active: isActiveLink('/orders') }"
                to="/orders"
            >
              Zamówienia
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
                class="nav-link"
                :class="{ active: isActiveLink('/init') }"
                to="/init"
            >
              Inicjalizacja
            </RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <RouterLink
                  class="nav-link"
                  :class="{ active: isActiveLink('/login') }"
                  to="/login"
              >
                Zaloguj
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                  class="nav-link"
                  :class="{ active: isActiveLink('/register') }"
                  to="/register"
              >
                Zarejestruj
              </RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <span class="nav-link">Witaj, {{ authStore.user.username }}</span>
            </li>
            <li class="nav-item">
              <button
                  @click="logout"
                  class="btn btn-danger"
              >
                Wyloguj
              </button>
            </li>
          </template>
        </ul>
        <RouterLink
            to="/cart"
            class="nav-link position-relative d-none d-lg-block mx-2"
            :class="{ active: isActiveLink('/cart') }"
        >
          <i class="pi pi-shopping-cart fs-4"></i>
          <span
              class="badge bg-danger text-white position-absolute translate-middle rounded-pill"
          >
            {{ authStore.isAuthenticated ? cartItemsQuantity : 0 }}
          </span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>