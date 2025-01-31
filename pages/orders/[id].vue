<script setup lang="ts">
const { $useApi } = useNuxtApp();
const router = useRouter();
console.log(router);
const route = useRoute();
definePageMeta({
  middleware: ['log-referrer'], // Применяем middleware
});
// Установка метатегов
useHead({
  title: 'Заказ',
});

// Инициализация состояний
const orderId = route.params.id;
const orderForm = ref({
  order_type: '',
  order_date: '',
  client: 0,
  client_address: 0,
  supplier: 0,
  vehicle_type: '',
  unit: 'm3',
  total_handled_volume: 0,
  material_volume: 0,
});
const orderTypes = ref([]);
const contractors = ref([]);
const vehicleTypes = ref([]);
const clientAddresses = ref([]);
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');

// Загрузка данных заказа
const fetchOrder = async () => {
  try {
    const { data: orderData } = await $useApi.get(`/orders/${orderId}`);
    orderForm.value = {
      order_type: orderData.order_type || '',
      order_date: orderData.order_date || '',
      client: orderData.client || 0,
      client_address: orderData.client_address || 0,
      supplier: orderData.supplier || 0,
      vehicle_type: orderData.vehicle_type || '',
      unit: orderData.unit || 'm3',
      total_handled_volume: orderData.total_handled_volume || 0,
      material_volume: orderData.material_volume || 0,
    };

    // Загрузка дополнительных данных
    const { data: typesResponse } = await $useApi.get('/order-types/');
    orderTypes.value = typesResponse;

    const { data: contractorsResponse } = await $useApi.get('/contractors/');
    contractors.value = contractorsResponse;

    const { data: vehicleTypesResponse } = await $useApi.get('/vehicle-types/');
    vehicleTypes.value = vehicleTypesResponse;

    if (orderForm.value.client) {
      const { data: addressesResponse } = await $useApi.get(
        `/contractor-addresses/?contractor=${orderForm.value.client}`
      );
      clientAddresses.value = addressesResponse;
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Обновление заказа
const saveOrder = async () => {
  try {
    const { data: updatedOrder } = await $useApi.patch(`/orders/${orderId}/`, orderForm.value);
    orderForm.value = updatedOrder;
    successMessage.value = 'Заказ успешно обновлён!';
    setTimeout(() => (successMessage.value = ''), 3000);
  } catch (err) {
    error.value = err.message;
  }
};

// Удаление заказа
const deleteOrder = async () => {
  try {
    await $useApi.delete(`/orders/${orderId}/`);
    console.log('Заказ удалён!');
    router.push('/orders');
  } catch (err) {
    console.error('Ошибка удаления заказа:', err);
  }
};

// Получение адресов клиента
const getClientAddresses = async (contractorId: number) => {
  try {
    const { data: addressesResponse } = await $useApi.get(`/contractor-addresses/?contractor=${contractorId}`);
    clientAddresses.value = addressesResponse;
  } catch (err) {
    console.error('Ошибка загрузки адресов контрагента:', err);
  }
};

onMounted(fetchOrder);
</script>

<template>
  <div>
    <div class="p-6">
      <div class="flex gap-3">
        <UiButton @click="router.back()" class="h-8 w-8">
          <
        </UiButton>
        <h1 class="text-2xl font-bold mb-4">Заказ</h1>
      </div>
      <div v-if="loading" class="text-center">
        <p>Загрузка...</p>
      </div>
      <div v-else-if="error" class="text-red-500 text-center">
        <p>Ошибка загрузки: {{ error }}</p>
      </div>
      <div v-else class="flex flex-col gap-3">
        <!-- Тип заказа -->
        <div>
          <UiLabel for="order_type">Тип заказа</UiLabel>
          <MyCombobox
            class="mt-2"
            :items="orderTypes.map(type => type.name)"
            :label="orderForm.order_type"
            @selected-item="(value) => orderForm.order_type = value"
          />
        </div>

        <!-- Дата заказа -->
        <div>
          <UiLabel for="order_date">Дата заказа</UiLabel>
          <UiInput
            class="mt-2"
            id="order_date"
            type="date"
            v-model="orderForm.order_date"
            placeholder="Выберите дату"
          />
        </div>

        <!-- Клиент -->
        <div class="flex flex-col gap-2">
          <UiLabel for="client">Клиент</UiLabel>
          <MyComboboxModels
            :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
            :label="contractors.find(c => c.id === orderForm.client)?.name || 'Выбрать клиента'"
            @selected-item="async (value) => { orderForm.client = value; await getClientAddresses(value); }"
          />
        </div>

        <!-- Адрес клиента -->
        <div class="flex flex-col gap-2">
          <UiLabel for="client_address">Адрес клиента</UiLabel>
          <MyComboboxModels
            :items="clientAddresses.map(address => ({ value: address.id, label: address.address }))"
            :label="clientAddresses.find(addr => addr.id === orderForm.client_address)?.address || 'Выбрать адрес'"
            @selected-item="(value) => orderForm.client_address = value"
          />
        </div>

        <!-- Поставщик -->
        <div class="flex flex-col gap-2">
          <UiLabel for="supplier">Поставщик</UiLabel>
          <MyComboboxModels
            :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
            :label="contractors.find(c => c.id === orderForm.supplier)?.name || 'Выбрать поставщика'"
            @selected-item="(value) => orderForm.supplier = value"
          />
        </div>

        <!-- Тип транспорта -->
        <div>
          <UiLabel for="vehicle_type">Тип транспорта</UiLabel>
          <MyCombobox
            class="mt-2"
            :items="vehicleTypes.map(vehicle => vehicle.name)"
            :label="orderForm.vehicle_type"
            @selected-item="(value) => orderForm.vehicle_type = value"
          />
        </div>

        <!-- Единица измерения -->
        <div>
          <UiLabel for="unit">Единица измерения</UiLabel>
          <UiSelect v-model="orderForm.unit">
            <UiSelectTrigger>
              <UiSelectValue placeholder="Выберите единицу" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem value="m3">м³</UiSelectItem>
              <UiSelectItem value="ton">Тонны</UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>

        <!-- Общий объем -->
        <div>
          <UiLabel for="total_handled_volume">Общий объем</UiLabel>
          <UiInput
            class="mt-2"
            id="total_handled_volume"
            type="number"
            v-model="orderForm.total_handled_volume"
            placeholder="Введите общий объем"
          />
        </div>

        <!-- Объем материала -->
        <div>
          <UiLabel for="material_volume">Объем материала</UiLabel>
          <UiInput
            class="mt-2"
            id="material_volume"
            type="number"
            v-model="orderForm.material_volume"
            placeholder="Введите объем материала"
          />
        </div>

        <!-- Кнопки действий -->
        <div class="mt-4 flex justify-between">
          <UiButton @click.stop="deleteOrder">Удалить</UiButton>
          <UiButton @click="saveOrder">Сохранить</UiButton>
        </div>

        <!-- Сообщение об успехе -->
        <p v-if="successMessage" class="text-green-500 mt-4">
          {{ successMessage }}
        </p>
      </div>
    </div>
    <UiSeparator />
  </div>
</template>