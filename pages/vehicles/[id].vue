<script setup lang="ts">
const { $useApi } = useNuxtApp();
const router = useRouter();
const route = useRoute();
useHead({
  title: 'Транспорт',
});

const vehicleId = route.params.id;
const vehicleForm = ref({
  vehicle_type: '',
  registration_number: '',
  volume: 0,
  insurance_expiry: '',
  mkad_pass_expiry: '',
  status: '',
});
const vehicleTypes = ref([]);
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');

// Fetch vehicle data on load
const fetchVehicle = async () => {
  try {
    const {data: vehicleData} = await $useApi.get(`/vehicles/${vehicleId}/`);

    vehicleForm.value = {
      vehicle_type: vehicleData.vehicle_type || '',
      registration_number: vehicleData.registration_number || '',
      volume: vehicleData.volume || 0,
      insurance_expiry: vehicleData.insurance_expiry || '',
      mkad_pass_expiry: vehicleData.mkad_pass_expiry || '',
      status: vehicleData.status || '',
    };

    const {data: vehicleTypesData}  = await $useApi.get('/vehicle-types/');
    vehicleTypes.value = vehicleTypesData;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Update vehicle data
const saveVehicle = async () => {
  try {
    const {data: updatedVehicle} = await $useApi.patch(`/vehicles/${vehicleId}/`,vehicleForm.value);

    successMessage.value = 'Транспортное средство успешно обновлено!';
    setTimeout(() => (successMessage.value = ''), 3000);
    vehicleForm.value = updatedVehicle;
  } catch (err) {
    error.value = err.message;
  }
};

const deleteVehicle = async () => {
  try {
    const response = await $useApi.delete(`/vehicles/${vehicleId}`);

    console.log('Транспортное средство удалено!');
    router.push('/vehicles');
  } catch (err) {
    console.error('Ошибка удаления транспортного средства:', err);
  }
};

onMounted(fetchVehicle);
</script>

<template>
  <div class="p-6">
    <div class="flex gap-3">
      <UiButton @click="router.push('/vehicles')" class="h-8 w-8"> < </UiButton>
      <h1 class="text-2xl font-bold mb-4">Транспорт</h1>
    </div>

    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>Ошибка загрузки: {{ error }}</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div>
        <UiLabel for="vehicle_type">Тип ТС</UiLabel>
        <MyCombobox
          class="mt-2 w-full"
          :items="vehicleTypes.map(type => type.name)"
          :label="vehicleForm.vehicle_type"
          @selected-item="(value) => vehicleForm.vehicle_type = value"
        />
      </div>
      <div>
        <UiLabel for="registration_number">Номер регистрации</UiLabel>
        <UiInput
          class="mt-2"
          id="registration_number"
          v-model="vehicleForm.registration_number"
          placeholder="Введите номер регистрации"
        />
      </div>
      <div>
        <UiLabel for="volume">Объем</UiLabel>
        <UiInput
          class="mt-2"
          id="volume"
          type="number"
          v-model="vehicleForm.volume"
          placeholder="Введите объем"
        />
      </div>
      <div>
        <UiLabel for="insurance_expiry">Дата окончания страховки</UiLabel>
        <UiInput
          class="mt-2"
          id="insurance_expiry"
          type="date"
          v-model="vehicleForm.insurance_expiry"
        />
      </div>
      <div>
        <UiLabel for="mkad_pass_expiry">Дата окончания пропуска МКАД</UiLabel>
        <UiInput
          class="mt-2"
          id="mkad_pass_expiry"
          type="date"
          v-model="vehicleForm.mkad_pass_expiry"
        />
      </div>
      <div>
        <UiLabel for="status">Статус</UiLabel>
        <UiInput
          class="mt-2"
          id="status"
          v-model="vehicleForm.status"
          placeholder="Введите статус"
        />
      </div>
      <div class="mt-4 flex justify-between">
        <UiButton @click.stop="deleteVehicle">Удалить</UiButton>
        <UiButton @click="saveVehicle">Сохранить</UiButton>
      </div>
      <p v-if="successMessage" class="text-green-500 mt-4">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>
