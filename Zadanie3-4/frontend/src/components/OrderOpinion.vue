<script setup>
import { ref } from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";

const toast = useToast();

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  isClient: {
    type: Boolean,
    required: true,
  },
});

const newOpinion = ref({
  rating: 5,
  comment: "",
});

const isModalVisible = ref(false);

const openModal = () => {
  newOpinion.value = { rating: 5, comment: "" };
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const submitOpinion = async () => {
  try {
    if (!newOpinion.value.comment || newOpinion.value.comment.length < 5) {
      toast.info("Komentarz musi mieć co najmniej 5 znaków.");
      return;
    }

    await axios.post(`/api/orders/${props.order._id}/opinions`, {
      ...newOpinion.value,
    });

    props.order.opinions.push({
      ...newOpinion.value,
      createdAt: new Date(),
    });

    closeModal();
  } catch (error) {
    console.error("Błąd podczas dodawania opinii:", error);
    toast.error("Wystąpił błąd podczas dodawania opinii.");
  }
};
</script>

<template>
  <div class="mt-3">
    <ul v-if="order.opinions && order.opinions.length > 0" class="list-group mb-3">
      <li v-for="(opinion, index) in order.opinions" :key="index" class="list-group-item">
        <strong>Ocena:</strong> {{ opinion.rating }}/5
        <p>{{ opinion.comment }}</p>
        <small class="text-muted">Dodano: {{ new Date(opinion.createdAt).toLocaleDateString() }}</small>
      </li>
    </ul>
    <p v-else>Brak opinii dla tego zamówienia.</p>

    <button
        v-if="isClient && ['FULFILED', 'CANCELLED'].includes(order.orderStatus.name) && order.opinions.length === 0"
        @click="openModal"
        class="btn btn-primary"
    >
      Dodaj opinię
    </button>
    <button
      v-if="isClient && ['APPROVED', 'UNAPPROVED'].includes(order.orderStatus.name) && order.opinions.length === 0"
      class="btn btn-primary"
      :disabled="true"
      >Dodaj opinię</button>

    <div v-if="isModalVisible" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Dodaj opinię</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Zamknij"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label for="rating">Ocena</label>
              <select id="rating" v-model="newOpinion.rating" class="form-select">
                <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>
            <div class="mb-2">
              <label for="comment">Komentarz</label>
              <textarea
                  id="comment"
                  v-model="newOpinion.comment"
                  class="form-control"
                  rows="3"
                  placeholder="Dodaj swój komentarz"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Anuluj</button>
            <button type="button" class="btn btn-primary" @click="submitOpinion">Dodaj opinię</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
</style>