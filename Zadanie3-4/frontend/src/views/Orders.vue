<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import axios from "axios";
import {useAuthStore} from "@/stores/auth.js";
import OrderOpinion from "@/components/OrderOpinion.vue";

const authStore = useAuthStore();

const state = reactive({
  stateIsLoading: true,
  orders: [],
});

const sortBy = ref("approvalDate");
const sortDirection = ref(1);
const showUnapprovedOnly = ref(false);

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
    order.approvalDate=  new Date();
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
      const response = await axios.get(`/api/orders/`);
      state.orders = response.data.orders;
    }
  } catch (error) {
    console.error(error);
  } finally {
    state.stateIsLoading = false;
  }
});

const sortedOrders = computed(() => {
  return filteredOrders.value.slice().sort((a, b) => {
    let valA, valB;

    switch (sortBy.value) {
      case "approvalDate":
        valA = a.approvalDate ? new Date(a.approvalDate) : new Date();
        valB = b.approvalDate ? new Date(b.approvalDate) : new Date();
        break;
      case "totalAmount":
        valA = parseFloat(calculateTotalAmount(a.orderedItems));
        valB = parseFloat(calculateTotalAmount(b.orderedItems));
        break;
    }

    return (valA > valB ? 1 : valA < valB ? -1 : 0) * sortDirection.value;
  });
});

const filteredOrders = computed(() => {
  return showUnapprovedOnly.value
      ? state.orders.filter(order => order.orderStatus.name === 'UNAPPROVED')
      : state.orders;
});
</script>

<template>
  <div v-if="state.stateIsLoading" class="text-center">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
  </div>

  <div v-else>
    <div class="mb-3 form-check mx-2">
      <input type="checkbox" v-model="showUnapprovedOnly" id="filterUnapproved" class="form-check-input" />
      <label for="filterUnapproved" class="form-check-label">Pokaż tylko niezrealizowane zamówienia</label>
    </div>

    <div v-if="state.orders.length !== 0">
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="table-light">
          <tr>
            <th @click="onSort('approvalDate')" style="cursor: pointer">
              Data zatwierdzenia
              <span v-if="sortBy === 'approvalDate'">
                  <i :class="sortDirection === 1 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
              </span>
              <span v-else>
                <i :class="sortDirection === 1 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="opacity-25"></i>
              </span>
            </th>
            <th>Email</th>
            <th>Numer telefonu</th>
            <th @click="onSort('totalAmount')" style="cursor: pointer">
              Łączna wartość
              <span v-if="sortBy === 'totalAmount'">
                  <i :class="sortDirection === 1 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
              </span>
              <span v-else>
                <i :class="sortDirection === 1 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="opacity-25"></i>
              </span>
            </th>
            <th>Status</th>
            <th>Produkty</th>
            <th>Opinie</th>
            <th v-if="!authStore.isClient"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in sortedOrders" :key="order._id">
            <td>{{ order.approvalDate ? new Date(order.approvalDate).toLocaleDateString() : 'Niezatwierdzone' }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.phoneNumber }}</td>
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
            <td>
              <button class="btn btn-link" data-bs-toggle="modal" :data-bs-target="'#productsModal-' + order._id">
                <i class="pi pi-ellipsis-v"></i>
              </button>
            </td>
            <td>
              <OrderOpinion :order="order" :isClient="authStore.isClient" />
            </td>
            <td v-if="authStore.isEmployee">
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

  <div v-for="order in sortedOrders" :key="'modal-' + order._id">
    <div class="modal fade" :id="'productsModal-' + order._id" tabindex="-1" aria-labelledby="'productsModalLabel-' + order._id" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="'productsModalLabel-' + order._id">Produkty w zamówieniu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul>
              <li v-for="item in order.orderedItems" :key="item.product?._id">
                {{ item.product?.name ? item.product.name : 'Usunięty produkt' }} -
                {{ item.quantity }} szt. - cena {{ item.priceAtOrder }} zł za szt.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
