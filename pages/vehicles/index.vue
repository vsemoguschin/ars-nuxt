<script setup lang="ts">
const router = useRouter();
useHead({
  title: 'Транспортные средства',
});

const vehicles = ref([]);
const vehicleTypes = ref([]);
const loading = ref(true);
const error = ref(null);
const isDialogOpen = ref(false);
const newVehicle = ref({
  vehicle_type: '',
  registration_number: '',
  volume: 0,
  insurance_expiry: '',
  mkad_pass_expiry: '',
  status: '',
});

// Fetch vehicles and vehicle types
const fetchVehicles = async () => {
  try {
    const response = await fetch('https://faunaplus24.ru/api/vehicles/');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    vehicles.value = await response.json();

    const res = await fetch('https://faunaplus24.ru/api/vehicle-types/');
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    vehicleTypes.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Create vehicle
const createVehicle = async () => {
  try {
    const response = await fetch('https://faunaplus24.ru/api/vehicles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVehicle.value),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    // Add new vehicle to the list
    const createdVehicle = await response.json();
    vehicles.value.push(createdVehicle);

    // Close dialog
    isDialogOpen.value = false;

    // Reset form
    newVehicle.value = {
      vehicle_type: '',
      registration_number: '',
      volume: 0,
      insurance_expiry: '',
      mkad_pass_expiry: '',
      status: '',
    };
  } catch (err) {
    console.error('Ошибка создания транспортного средства:', err);
  }
};

onMounted(fetchVehicles);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Список транспортных средств</h1>

    <div class="flex gap-2 mb-4">
      <UiButton @click="router.push('/')" class="h-8 w-8"> < </UiButton>
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton @click="isDialogOpen = true" class="h-8 w-8"> + </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Создать транспортное средство</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <div class="flex flex-col gap-3">
            <div>
              <UiLabel for="vehicle_type">Тип ТС</UiLabel>
              <MyCombobox
                class="mt-2"
                :items="vehicleTypes.map(type => type.name)"
                :label="'Тип ТС'"
                @selected-item="(value) => newVehicle.vehicle_type = value"
              />
            </div>
            <div>
              <UiLabel for="registration_number">Номер регистрации</UiLabel>
              <UiInput
                class="mt-2"
                id="registration_number"
                v-model="newVehicle.registration_number"
                placeholder="Введите номер регистрации"
              />
            </div>
            <div>
              <UiLabel for="volume">Объем</UiLabel>
              <UiInput
                class="mt-2"
                id="volume"
                type="number"
                v-model="newVehicle.volume"
                placeholder="Введите объем"
              />
            </div>
            <div>
              <UiLabel for="insurance_expiry">Дата окончания страховки</UiLabel>
              <UiInput
                class="mt-2"
                id="insurance_expiry"
                type="date"
                v-model="newVehicle.insurance_expiry"
              />
            </div>
            <div>
              <UiLabel for="mkad_pass_expiry"
                >Дата окончания пропуска МКАД</UiLabel
              >
              <UiInput
                class="mt-2"
                id="mkad_pass_expiry"
                type="date"
                v-model="newVehicle.mkad_pass_expiry"
              />
            </div>
            <div>
              <UiLabel for="status">Статус</UiLabel>
              <UiInput
                class="mt-2"
                id="status"
                v-model="newVehicle.status"
                placeholder="Введите статус"
              />
            </div>
          </div>
          <UiDialogFooter>
            <div class="flex justify-between w-full">
              <UiButton class="mb-2" @click="isDialogOpen = false"
                >Отмена</UiButton
              >
              <UiButton @click="createVehicle">Создать</UiButton>
            </div>
          </UiDialogFooter>
        </UiDialogContent>
      </UiDialog>
    </div>

    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>Ошибка загрузки: {{ error }}</p>
    </div>

    <!-- Vehicles Table -->
    <div v-else>
      <UiTable>
        <UiTableCaption>Список транспортных средств.</UiTableCaption>
        <UiTableHeader class="bg-slate-100">
          <UiTableRow>
            <UiTableHead>Номер регистрации</UiTableHead>
            <UiTableHead>Тип ТС</UiTableHead>
            <UiTableHead>Статус</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            @click="router.push(`/vehicles/${vehicle.id}`)"
            class="cursor-pointer hover:bg-gray-100"
          >
            <UiTableCell>{{ vehicle.registration_number }}</UiTableCell>
            <UiTableCell>{{ vehicle.vehicle_type }}</UiTableCell>
            <UiTableCell>{{ vehicle.status }}</UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
