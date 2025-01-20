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
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink
                class="nav-link"
                :class="{ active: isActiveLink('/') }"
                to="/"
            >
              Produkty
            </RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <template v-if="!isLoggedIn">
              <li class="nav-item">
                <RouterLink
                    class="nav-link"
                    :class="{ active: isActiveLink('/login') }"
                    to="/login"
                >Zaloguj</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink
                    class="nav-link"
                    :class="{ active: isActiveLink('/register') }"
                    to="/register"
                >Zarejestruj</RouterLink>
              </li>
            </template>
          <template v-else>
            <li class="nav-item">
              <span class="nav-link">Witaj, {{ authStore.user.username }}</span>
            </li>
            <li class="nav-item">
              <button
                  v-if="isLoggedIn"
                  @click="logout"
                  class="btn btn-outline-danger ms-2"
              >
                Wyloguj
              </button>
            </li>
          </template>
          <li class="nav-item">
            <RouterLink
                to="/cart"
                class="nav-link position-relative"
                :class="{ active: isActiveLink('/cart') }"
            >
              <i class="pi pi-shopping-cart fs-4"></i>
              <span
                  class="badge bg-danger text-white position-absolute top-0 start-100 translate-middle rounded-pill"
              >
                {{ authStore.isAuthenticated ? cartItemsQuantity : 0 }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>