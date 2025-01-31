<script setup lang="ts">
const { $useApi } = useNuxtApp();
const router = useRouter();

// Состояния
useHead({
  title: 'Заказы',
});
const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const isDialogOpen = ref(false);

// Загрузка данных
const fetchOrders = async () => {
  try {
    const { data: ordersData } = await $useApi.get('/orders/');
    orders.value = ordersData;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Заказы</h1>
    <div class="flex gap-2 mb-4">
      <UiButton @click="router.push('/')" class="h-8 w-8"> < </UiButton>
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton class="h-8 w-8"> + </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Создать заказ</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <!-- форма создания заказа -->
          <MyOrdersOrderForm
            @order-created="()=>{fetchOrders(), isDialogOpen=false}"
          />
          <!-- форма создания заказа -->
          <UiDialogFooter />
        </UiDialogContent>
      </UiDialog>
    </div>

    <!-- Отображение данных -->
    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="text-red-500 text-center">
      <p>Ошибка загрузки: {{ error }}</p>
    </div>
    <div v-else>
      <MyOrdersTable :orders="orders"/>
    </div>
  </div>
</template>
