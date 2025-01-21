<script setup>
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth.js";
import { useToast } from "vue-toastification";
import {onMounted, ref} from "vue";
import axios from "axios";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  }
});

const cartStore = useCartStore();
const authStore = useAuthStore();
const toast = useToast();

const quantity = ref(1);
const isAdded = ref(false);
const isEditModalOpen = ref(false);
const editedProduct = ref({ ...props.product });

onMounted(() => {
  const defaultCategory = props.categories.find(category => category._id === props.product.category._id);
  if (defaultCategory) {
    editedProduct.value.category = defaultCategory;
  }
});

const addToCart = () => {
  if (!authStore.isAuthenticated) {
    toast.info("Musisz być zalogowany, aby dodać produkt do koszyka.");
    return;
  }
  cartStore.addToCart(props.product, quantity.value);

  isAdded.value = true;

  setTimeout(() => {
    isAdded.value = false;
  }, 200);
};

const editProduct = () => {
  isEditModalOpen.value = true;
};

const saveProductChanges = async () => {
  try {
    await axios.put(`/api/products/${editedProduct.value._id}`, editedProduct.value);
    props.product.name = editedProduct.value.name;
    props.product.description = editedProduct.value.description;
    props.product.category = editedProduct.value.category;
    props.product.unitPrice = editedProduct.value.unitPrice;
    toast.success("Produkt został zaktualizowany.");
    isEditModalOpen.value = false;
  } catch (error) {
    console.error(error);
    toast.error("Wystąpił błąd podczas aktualizacji produktu.");
  }
};

const closeModal = () => {
  isEditModalOpen.value = false;
};
</script>

<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text">{{ product.category.name }}</p>
      <p class="card-text">{{ product.description }}</p>
      <p class="card-text fw-bold">{{ product.unitPrice }} zł</p>

      <div class="mb-3" v-if="authStore.isClient">
        <label for="quantity-select" class="form-label">Wybierz ilość:</label>
        <select id="quantity-select" class="form-select" v-model="quantity">
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <button
          v-if="authStore.isClient"
          class="btn btn-primary mt-auto"
          :class="{ 'btn-success': isAdded, 'animate__animated animate__pulse': isAdded }"
          @click="addToCart"
      >
        Dodaj do koszyka
      </button>

      <button
          v-if="authStore.isEmployee"
          class="btn btn-warning mt-2"
          @click="editProduct"
      >
        Edytuj
      </button>
    </div>
  </div>

  <div v-if="isEditModalOpen" class="modal-backdrop fade show"></div>

  <div v-if="isEditModalOpen" class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edycja produktu</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProductChanges">
            <div class="mb-3">
              <label for="name" class="form-label">Nazwa</label>
              <input type="text" class="form-control" id="name" v-model="editedProduct.name" required />
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Opis</label>
              <textarea class="form-control" id="description" v-model="editedProduct.description" required></textarea>
            </div>
            <div class="mb-3">
              <label for="unitPrice" class="form-label">Cena</label>
              <input type="number" step=".01" class="form-control" id="unitPrice" v-model="editedProduct.unitPrice" required />
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">Kategoria</label>
              <select class="form-select" id="category" v-model="editedProduct.category" required>
                <option v-for="category in props.categories" :key="category._id" :value="category">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Zapisz zmiany</button>
            <button type="button" class="btn btn-secondary ms-2" @click="closeModal">Anuluj</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  max-width: 100%;
}
</style>