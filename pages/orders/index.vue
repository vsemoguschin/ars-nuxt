<script setup lang="ts">

const router = useRouter();
useHead({
  title: 'Заказы',
});

const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const isDialogOpen = ref(false);

// Fetch orders and related data
const fetchOrders = async () => {
  try {
    const response = await fetch('https://vm42106.vpsone.xyz/api/orders/');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    orders.value = await response.json();
    console.log(orders.value[0]);

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
    <h1 class="text-2xl font-bold mb-4">Список заказов</h1>

    <div class="flex gap-2 mb-4">
      <UiButton @click="router.push('/')" class="h-8 w-8"> < </UiButton>
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton @click="isDialogOpen = true" class="h-8 w-8"> + </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Создать заказ</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <MyOrdersCreateForm
            @order-created="async () => {await fetchOrders(); isDialogOpen=false}"
          />
          <UiDialogFooter> </UiDialogFooter>
        </UiDialogContent>
      </UiDialog>
    </div>

    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>Ошибка загрузки: {{ error }}</p>
    </div>

    <!-- Orders Table -->
    <div v-else>
      <MyOrdersTable :orders="orders"/>
    </div>
  </div>
</template>
