<script setup>
import { useCartStore } from "@/stores/cart.js";
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";

const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

const cartItems = computed(() => Object.values(cartStore.cart));

const phoneRegex = /^[0-9]{9,15}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const email = ref("");
const phoneNumber = ref("");

const removeFromCart = (productId) => {
  cartStore.removeFromCart(productId);
};

const submitOrder = async () => {
  if (!email.value || !phoneNumber.value) {
    toast.info("Wszystkie dane kontaktowe są wymagane.");
    return;
  }

  if (!phoneRegex.test(phoneNumber.value)) {
    toast.info("Numer telefonu jest niepoprawny. Użyj 9-15 cyfr.");
    return;
  }

  if (!emailRegex.test(email.value)) {
    toast.info("Adres email jest niepoprawny.");
    return;
  }

  try {
    await axios.post("/api/orders", {
          username: authStore.user.username,
          email: email.value,
          phoneNumber: phoneNumber.value,
          products: cartItems.value.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            priceAtOrder: item.unitPrice,
          })),
        },
    );

    toast.success("Zamówienie zostało złożone!");
    cartStore.clearCart();
  } catch (error) {
    console.error(error);
    toast.error("Wystąpił błąd przy tworzeniu zamówienia.");
  }
};
</script>

<template>
  <div class="container mt-4">
    <h2>Twój koszyk</h2>
    <div v-if="cartItems.length === 0" class="text-center mt-4">
      <p>Koszyk jest pusty.</p>
    </div>
    <template v-else>
      <table class="table table-hover mt-3">
        <thead>
        <tr>
          <th>#</th>
          <th>Nazwa produktu</th>
          <th>Cena</th>
          <th>Ilość</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in cartItems" :key="item._id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.unitPrice }} zł</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="removeFromCart(item._id)">
              Usuń
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <h4>Łączna cena zamówienia: {{cartStore.totalPrice}} zł.</h4>
    </template>


    <div v-if="cartItems.length > 0" class="mt-4">
      <h3>Podaj dane do zamówienia</h3>
      <form @submit.prevent="submitOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              required
              :class="{'is-invalid': email && !emailRegex.test(email)}"
          />
          <div v-if="email && !emailRegex.test(email)" class="invalid-feedback">
            Adres email jest niepoprawny.
          </div>
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Numer telefonu</label>
          <input
              type="tel"
              id="phoneNumber"
              v-model="phoneNumber"
              class="form-control"
              required
              :class="{'is-invalid': phoneNumber && !phoneRegex.test(phoneNumber)}"
          />
          <div v-if="phoneNumber && !phoneRegex.test(phoneNumber)" class="invalid-feedback">
            Numer telefonu jest niepoprawny. Użyj formatu 9-15 cyfr.
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Złóż zamówienie</button>
      </form>
    </div>
  </div>
</template>

<style>
.table {
  max-width: 100%;
}
</style>