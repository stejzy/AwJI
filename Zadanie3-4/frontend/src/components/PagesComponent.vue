<template>
  <div>
    <NavbarComponent></NavbarComponent>
    <router-view></router-view>
  </div>
</template>

<script>
import NavbarComponent from "./NavbarComponent.vue";
export default {
  name: "PagesComponent",
  components: {
    NavbarComponent,
  },
};
</script>
