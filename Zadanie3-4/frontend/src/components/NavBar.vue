<script setup>
  import {RouterLink, useRoute} from "vue-router";
  import {useAuthStore} from "@/stores/auth.js";
  import {computed} from "vue";
  import router from "@/router/routes.js";

  const isActiveLink = (routePath) => {
    const route = useRoute();
    return route.path === routePath;
  }

  const authStore = useAuthStore();

  const isLoggedIn = computed(() => {
    return authStore.isAuthenticated;
  });

  const logout = () => {
    authStore.logout();
    router.push('/');
  }
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">AWJI</RouterLink>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
<!--          <li class="nav-item">-->
<!--            <RouterLink-->
<!--                :class="[isActiveLink('/') ? 'bg-green-900' : 'hover:bg-gray-900', 'nav-link', 'active']"-->
<!--                to="/"-->
<!--            >Products</RouterLink>-->
<!--          </li>-->
          <li class="nav-item d-flex align-items-center">
            <RouterLink
                v-if="!isLoggedIn"
                :class="[isActiveLink('/login') ? 'bg-green-900' : 'hover:bg-gray-900', 'nav-link']"
                to="/login"
            >Zaloguj</RouterLink>
            <RouterLink
                v-if="!isLoggedIn"
                :class="[isActiveLink('/register') ? 'bg-green-900' : 'hover:bg-gray-900', 'nav-link']"
                to="/register"
            >Zarejestruj</RouterLink>
            <span v-else class="nav-link me-3">Witaj, {{ authStore.user.username }}</span>
            <button v-if="isLoggedIn" @click="logout" class="btn btn-danger">
              Wyloguj
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>