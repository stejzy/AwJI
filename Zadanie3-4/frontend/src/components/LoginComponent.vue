<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="w-50 p-4 border rounded shadow">
      <h1 class="text-center">Login</h1>
      <form @submit.prevent="login">
        <div class="form-group mt-5">
          <label for="email">Email address</label>
          <input
            type="email"
            v-model="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div class="form-group mt-3">
          <label for="password">Password</label>
          <input
            type="password"
            v-model="password"
            class="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 mt-3">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {},
};
</script>
