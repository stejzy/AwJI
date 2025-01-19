<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="w-50 p-4 border rounded shadow">
      <h1 class="text-center">Register</h1>
      <form @submit.prevent="register">
        <div class="form-group mt-5">
          <label for="username">Username</label>
          <input
            type="text"
            v-model="username"
            class="form-control"
            id="username"
            aria-describedby="usernameHelp"
            placeholder="Enter username"
          />
          <small v-if="usernameError" class="text-danger">{{
            usernameError
          }}</small>
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
        <div class="form-group mt-3">
          <label for="password">Confirm password</label>
          <input
            type="password"
            v-model="password2"
            class="form-control"
            id="password2"
            placeholder="Confirm password"
          />
          <small v-if="passwordError" class="text-danger">{{
            passwordError
          }}</small>
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
      username: "",
      password: "",
      password2: "",
      usernameError: "",
      passwordError: "",
    };
  },
  methods: {
    register() {
      this.registerError = "";
      this.passwordError = "";
      const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
      if (!usernameRegex.test(this.username)) {
        this.usernameError = "Invalid username.";
        return;
      }

      if (this.password.length < 4) {
        this.passwordError = "Invalid password.";
        return;
      }

      if (this.password !== this.password2) {
        this.passwordError = "Passwords do not match.";
        return;
      }

      alert("Registration successful!");
    },
  },
};
</script>
