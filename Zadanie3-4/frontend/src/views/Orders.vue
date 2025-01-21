<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();

const state = reactive({
  stateIsLoading: true,
  orders: [],
});

const sortBy = ref("approvalDate");
const sortDirection = ref(1);

const onSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = -sortDirection.value;
  } else {
    sortBy.value = column;
    sortDirection.value = 1;
  }
};

const calculateTotalAmount = (orderedItems) => {
  return orderedItems
      .reduce((total, item) => {
        return total + item.quantity * item.priceAtOrder;
      }, 0)
      .toFixed(2);
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.patch(`/api/orders/${orderId}`, {
      statusName: newStatus,
    });
    const order = state.orders.find((order) => order._id === orderId);
    if (order) order.orderStatus.name = newStatus;
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

onMounted(async () => {
  try {
    if (authStore.isClient) {
      const response = await axios.get(`/api/orders/user/${authStore.user.username}`);
      state.orders = response.data.orders;
    } else if (authStore.isEmployee) {
      const response = await axios.get(`/api/orders/status/UNAPPROVED`);
      state.orders = response.data.orders;
    }
  } catch (error) {
    console.error(error);
  } finally {
    state.stateIsLoading = false;
  }
});

const sortedOrders = computed(() => {
  return state.orders.slice().sort((a, b) => {
    let valA, valB;

    switch (sortBy.value) {
      case "approvalDate":
        valA = a.approvalDate ? new Date(a.approvalDate) : new Date();
        valB = b.approvalDate ? new Date(b.approvalDate) : new Date();
        break;
      case "totalAmount":
        valA = calculateTotalAmount(a.orderedItems);
        valB = calculateTotalAmount(b.orderedItems);
        break;
    }

    return (valA > valB ? 1 : valA < valB ? -1 : 0) * sortDirection.value;
  });
});
</script>

<template>
  <div v-if="state.stateIsLoading" class="text-center">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
  </div>

  <div v-else>
    <div v-if="state.orders.length !== 0">
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="table-light">
          <tr>
            <th @click="onSort('approvalDate')" style="cursor: pointer">
              Data zamówienia
              <span v-if="sortBy === 'approvalDate'">
                  <i :class="sortDirection === 1 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                </span>
            </th>
            <th v-if="authStore.isClient">Email</th>
            <th v-if="authStore.isClient">Numer telefonu</th>
            <th @click="onSort('totalAmount')" style="cursor: pointer">
              Łączna wartość
              <span v-if="sortBy === 'totalAmount'">
                  <i :class="sortDirection === 1 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                </span>
            </th>
            <th>Status</th>
            <th v-if="!authStore.isClient">Akcje</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(order, index) in sortedOrders" :key="order._id">
            <td>{{ order.approvalDate ? new Date(order.approvalDate).toLocaleDateString() : 'Niezatwierdzone' }}</td>
            <td v-if="authStore.isClient">{{ order.email }}</td>
            <td v-if="authStore.isClient">{{ order.phoneNumber }}</td>
            <td>{{ calculateTotalAmount(order.orderedItems) }} zł</td>
            <td>
                <span
                    :class="{
                    badge: true,
                    'bg-success': order.orderStatus.name === 'APPROVED',
                    'bg-warning': order.orderStatus.name === 'UNAPPROVED',
                    'bg-danger': order.orderStatus.name === 'CANCELLED',
                  }"
                >
                  {{ order.orderStatus.name }}
                </span>
            </td>
            <td v-if="!authStore.isClient">
              <button
                  v-if="order.orderStatus.name === 'UNAPPROVED'"
                  class="btn btn-success btn-sm me-2"
                  @click="updateOrderStatus(order._id, 'APPROVED')"
              >
                Zatwierdź
              </button>
              <button
                  v-if="order.orderStatus.name === 'UNAPPROVED'"
                  class="btn btn-danger btn-sm"
                  @click="updateOrderStatus(order._id, 'CANCELLED')"
              >
                Anuluj
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-else class="text-center">Nie znaleziono zamówień.</p>
  </div>
</template>

<style scoped>

</style>
