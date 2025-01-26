<script setup lang="ts">
const router = useRouter();
const route = useRoute();
useHead({
  title: 'Заявка',
});

const orderId = route.params.id;

const orderTypes = ref([]);
const contractors = ref([]);
const clientAddresses = ref([]);
const vehicleTypes = ref([]);
const drivers = ref([]);

const orderBlank = {
    order_type: '',
    order_date: '',
    client: 0,
    client_address: 0,
    supplier: 0,
    vehicle_type: '',
    unit: 'ton',
    material_volume: 0,
};

const newOrder = ref({ ...orderBlank });

const loading = ref(true);
const error = ref(null);
const successMessage = ref('');

const fetchOrder = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/orders/${orderId}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    newOrder.value = await response.json();
    console.log(newOrder.value);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

const fetchOrderTypes = async () => {
  try {
    const response = await fetch('https://vm42106.vpsone.xyz/api/order-types/');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    orderTypes.value = await response.json();
  } catch (err) {
    console.error('Ошибка загрузки типов заказов:', err);
  }
};

const fetchContractors = async () => {
  try {
    const response = await fetch('https://vm42106.vpsone.xyz/api/contractors/');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    contractors.value = await response.json();
  } catch (err) {
    console.error('Ошибка загрузки контрагентов:', err);
  }
};

const fetchAddresses = async (contractorId) => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/contractor-addresses/?contractor=${contractorId}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    clientAddresses.value = await response.json();
    newOrder.value.client_address = 0;
    newOrder.value.client_address_info.address = 'Выберите адрес клиента'
    console.log('addresses', contractorId, clientAddresses.value);
  } catch (err) {
    console.error('Ошибка загрузки адресов клиента:', err);
  }
};

const fetchVehicleTypes = async () => {
  try {
    const response = await fetch('https://vm42106.vpsone.xyz/api/vehicle-types/');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    vehicleTypes.value = await response.json();
  } catch (err) {
    console.error('Ошибка загрузки типов транспортных средств:', err);
  }
};

const updateOrder = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/orders/${orderId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder.value),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    successMessage.value = 'Заявка успешно обновлена!';
    setTimeout(() => (successMessage.value = ''), 3000);
  } catch (err) {
    error.value = err.message;
  }
};

const deleteOrder = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/orders/${orderId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    console.log('Заявка удалена!');
    router.push('/orders');
  } catch (err) {
    console.error('Ошибка удаления авансового платежа:', err);
  }
};

onMounted(async () => {
  try {
    await fetchOrder();
    await fetchOrderTypes();
    await fetchContractors();
    await fetchVehicleTypes();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="p-6">
      <div class="flex gap-3">
        <UiButton @click="router.push('/orders')" class="h-8 w-8"> < </UiButton>
        <h1 class="text-2xl font-bold mb-4">Заявка</h1>
      </div>

      <div v-if="loading" class="text-center">
        <p>Загрузка...</p>
      </div>

      <div v-else-if="error" class="text-red-500 text-center">
        <p>Ошибка загрузки: {{ error }}</p>
      </div>
      <div v-else class="flex flex-col gap-3">
        <div>
          <UiLabel for="order_type">Тип заказа</UiLabel>
          <MyCombobox
            class="mt-2"
            :items="orderTypes.map(type => type.name)"
            :label="newOrder.order_type"
            @selected-item="(value) => newOrder.order_type = value"
          />
        </div>
        <div>
          <UiLabel for="order_date">Дата заказа</UiLabel>
          <UiInput
            class="mt-2"
            id="order_date"
            type="date"
            v-model="newOrder.order_date"
          />
        </div>
        <div class="flex flex-col gap-2">
          <UiLabel for="client">Клиент</UiLabel>
          <MyComboboxModels
            :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
            :label="newOrder.client_info.name"
            @selected-item="async(value) => { newOrder.client = value; await fetchAddresses(newOrder.client); }"
          />
        </div>
        <div class="flex flex-col gap-2">
          <UiLabel for="client_address">Адрес клиента</UiLabel>
          <MyComboboxModels
            :items="clientAddresses.map(address => ({ value: address.id, label: address.address }))"
            :label="newOrder.client_address_info.address"
            @selected-item="(value) => newOrder.client_address = value"
          />
        </div>
        <div class="flex flex-col gap-2">
          <UiLabel for="supplier">Поставщик</UiLabel>
          <MyComboboxModels
            :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
            :label="newOrder.supplier_info.name"
            @selected-item="(value) => newOrder.supplier = value"
          />
        </div>
        <div>
          <UiLabel for="vehicle_type">Тип ТС</UiLabel>
          <MyCombobox
            class="mt-2"
            :items="vehicleTypes.map(type => type.name)"
            :label="newOrder.vehicle_type"
            @selected-item="(value) => newOrder.vehicle_type = value"
          />
        </div>
        <div>
          <UiLabel for="unit">Единица измерения</UiLabel>
          <UiSelect v-model="newOrder.unit">
            <UiSelectTrigger>
              <UiSelectValue placeholder="Выберите единицу" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem value="m3">м³</UiSelectItem>
              <UiSelectItem value="ton">Тонны</UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>
        <div>
          <UiLabel for="material_volume">Объем материала</UiLabel>
          <UiInput
            class="mt-2"
            id="material_volume"
            type="number"
            v-model="newOrder.material_volume"
            placeholder="Введите объем материала"
          />
        </div>
        <div class="flex justify-between w-full">
          <UiButton class="mb-2" @click="deleteOrder">Удалить</UiButton>
          <UiButton @click="updateOrder">Сохранить</UiButton>
        </div>
        <p v-if="successMessage" class="text-green-500 mt-4">
          {{ successMessage }}
        </p>
      </div>
    </div>
  </div>
  <UiSeparator/>
  <div>

  </div>
</template>
