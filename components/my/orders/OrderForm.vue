<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { $useApi } = useNuxtApp();

// Пропсы
const props = defineProps({
  client: {
    type: Object,
    default: null, // Необязательный пропс
  },
  client_addresses: {
    type: Array,
    default: () => [], // Необязательный пропс
  },
});

// Состояния
const orderTypes = ref([]);
const contractors = ref([]);
const vehicleTypes = ref([]);
const clientAddresses = ref([]);
const newOrder = ref({
  order_type: '',
  order_date: '',
  client: props.client?.id || 0,
  client_address: props.client_addresses?.[0]?.id || 0,
  supplier: 0,
  vehicle_type: '',
  unit: 'm3',
  total_handled_volume: 0,
  material_volume: 0,
});
const isDialogOpen = ref(false);

// Загрузка данных
const fetchOrderTypes = async () => {
  try {
    const { data: orderTypesData } = await $useApi.get('/order-types/');
    orderTypes.value = orderTypesData;
  } catch (err) {
    console.error('Ошибка загрузки типов заказов:', err);
  }
};

const fetchContractors = async () => {
  try {
    const { data: contractorsData } = await $useApi.get('/contractors/');
    contractors.value = contractorsData;
  } catch (err) {
    console.error('Ошибка загрузки контрагентов:', err);
  }
};

const fetchVehicleTypes = async () => {
  try {
    const { data: vehicleTypesData } = await $useApi.get('/vehicle-types/');
    vehicleTypes.value = vehicleTypesData;
  } catch (err) {
    console.error('Ошибка загрузки типов транспортных средств:', err);
  }
};

const fetchClientAddresses = async (contractorId: number) => {
  try {
    const { data: addressesData } = await $useApi.get(`/contractor-addresses/?contractor=${contractorId}`);
    clientAddresses.value = addressesData;
  } catch (err) {
    console.error('Ошибка загрузки адресов контрагента:', err);
  }
};

// Создание заказа
const createOrder = async () => {
  try {
    const { data: createdOrder } = await $useApi.post('/orders/', newOrder.value);
    console.log('Заказ успешно создан:', createdOrder);
    resetForm();
    isDialogOpen.value = false;
    emit('order-created');
  } catch (err) {
    console.error('Ошибка создания заказа:', err);
  }
};

// Сброс формы
const resetForm = () => {
  newOrder.value = {
    order_type: '',
    order_date: '',
    client: props.client?.id || 0,
    client_address: props.client_addresses?.[0]?.id || 0,
    supplier: 0,
    vehicle_type: '',
    unit: 'm3',
    total_handled_volume: 0,
    material_volume: 0,
  };
};

const emit = defineEmits(['order-created']);

onMounted(() => {
  fetchOrderTypes();
  fetchContractors(); // Запрос выполняется только если client не передан
    fetchVehicleTypes();
  console.log(props.client);
  if (!props.client_addresses) {
    fetchClientAddresses(newOrder.value.client); // Запрос выполняется только если client_addresses не передан
  } else {
    clientAddresses.value = props.client_addresses; // Устанавливаем переданные адреса
  }
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Тип заказа -->
    <div>
      <UiLabel for="order_type">Тип заказа</UiLabel>
      <MyCombobox
        class="mt-2"
        :items="orderTypes.map(type => type.name)"
        :label="'Тип заказа'"
        @selected-item="(value) => newOrder.order_type = value"
      />
    </div>

    <!-- Дата заказа -->
    <div>
      <UiLabel for="order_date">Дата заказа</UiLabel>
      <UiInput
        class="mt-2"
        id="order_date"
        type="date"
        v-model="newOrder.order_date"
        placeholder="Выберите дату"
      />
    </div>

    <!-- Клиент -->
    <div class="flex flex-col gap-2">
      <UiLabel for="client">Клиент</UiLabel>
      <MyComboboxModels
        :items="client ? [{value: client.id, label: client.name}] : contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
        :label="client ? client.name :'Выбрать клиента'"
        @selected-item="async (value) => { newOrder.client = value; await fetchClientAddresses(value); }"
      />
    </div>

    <!-- Адрес клиента -->
    <div class="flex flex-col gap-2">
      <UiLabel for="client_address">Адрес клиента</UiLabel>
      <MyComboboxModels
        :items="clientAddresses.map(address => ({ value: address.id, label: address.address }))"
        :label="'Выбрать адрес'"
        @selected-item="(value) => newOrder.client_address = value"
      />
    </div>

    <!-- Поставщик -->
    <div class="flex flex-col gap-2">
      <UiLabel for="supplier">Поставщик</UiLabel>
      <MyComboboxModels
        :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
        :label="'Выбрать поставщика'"
        @selected-item="(value) => newOrder.supplier = value"
      />
    </div>

    <!-- Тип транспорта -->
    <div>
      <UiLabel for="vehicle_type">Тип транспорта</UiLabel>
      <MyCombobox
        class="mt-2"
        :items="vehicleTypes.map(vehicle => vehicle.name)"
        :label="'Тип транспорта'"
        @selected-item="(value) => newOrder.vehicle_type = value"
      />
    </div>

    <!-- Единица измерения -->
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

    <!-- Общий объем -->
    <div>
      <UiLabel for="total_handled_volume">Общий объем</UiLabel>
      <UiInput
        class="mt-2"
        id="total_handled_volume"
        type="number"
        v-model="newOrder.total_handled_volume"
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
        v-model="newOrder.material_volume"
        placeholder="Введите объем материала"
      />
    </div>
  </div>
  <UiButton @click="createOrder">Создать</UiButton>
</template>
