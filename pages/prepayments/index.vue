<script setup lang="ts">
const router = useRouter();
useHead({
  title: 'Предоплаты',
});

const prepayments = ref([]);
const prepaymentTypes = ref([]);
const contractors = ref([]);
const loading = ref(true);
const error = ref(null);
const isDialogOpen = ref(false);
const newPrepayment = ref({
    prepayment_type: '',
    unit: 'm3',
    total_volume: 0,
    remaining_volume: 0,
    price_per_unit: 0,
    total_price: 0,
    contractor: 0,
    contractor_name: '',
});




// Fetch prepayments, prepayment types, and contractors
const fetchPrepayments = async () => {
    try {
        const response = await fetch('https://vm42106.vpsone.xyz/api/prepayments/');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        prepayments.value = await response.json();

        await getPrepaymetTypes();

        await getContractors();
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const getPrepaymetTypes = async () => {
    const typesResponse = await fetch('https://vm42106.vpsone.xyz/api/prepayment-types/');
    if (!typesResponse.ok) throw new Error(`HTTP Error: ${typesResponse.status}`);
    prepaymentTypes.value = await typesResponse.json();
    return
};

const getContractors = async () => {
    const contractorsResponse = await fetch('https://vm42106.vpsone.xyz/api/contractors/');
    if (!contractorsResponse.ok) throw new Error(`HTTP Error: ${contractorsResponse.status}`);
    contractors.value = await contractorsResponse.json();
};

// Create prepayment
const createPrepayment = async () => {
    try {
        console.log('bvfcvh');
        const response = await fetch('https://vm42106.vpsone.xyz/api/prepayments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPrepayment.value),
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        // Add new prepayment to the list
        const createdPrepayment = await response.json();
        prepayments.value.push(createdPrepayment);

        // Close dialog
        isDialogOpen.value = false;

        // Reset form
        newPrepayment.value = {
            prepayment_type: '',
            unit: 'm3',
            total_volume: 0,
            remaining_volume: 0,
            price_per_unit: 0,
            total_price: 0,
            contractor: 0,
            contractor_name: '',

        };
    } catch (err) {
        console.error('Ошибка создания авансового платежа:', err);
    }
};

onMounted(fetchPrepayments);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Предоплаты</h1>

    <div class="flex gap-2 mb-4">
      <UiButton @click="router.push('/')" class="h-8 w-8"> < </UiButton>
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton
            @click="async () => { await getPrepaymetTypes(); await getContractors(); isDialogOpen = true}"
            class="h-8 w-8"
          >
            +
          </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Создать предоплату</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <div class="flex flex-col gap-3">
            <div>
              <UiLabel for="prepayment_type">Тип предоплаты</UiLabel>
              <MyCombobox
                class="mt-2"
                :items="prepaymentTypes.map(type => type.name)"
                :label="'Тип аванса'"
                @selected-item="(value) => newPrepayment.prepayment_type = value"
              />
            </div>
            <div>
              <UiLabel for="unit">Единица измерения</UiLabel>
              <UiSelect v-model="newPrepayment.unit">
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
              <UiLabel for="total_volume">Объем</UiLabel>
              <UiInput
                class="mt-2"
                id="total_volume"
                type="number"
                v-model="newPrepayment.total_volume"
                placeholder="Введите объем"
              />
            </div>
            <div>
              <UiLabel for="remaining_volume">Оставшийся объем</UiLabel>
              <UiInput
                class="mt-2"
                id="remaining_volume"
                type="number"
                v-model="newPrepayment.remaining_volume"
                placeholder="Введите оставшийся объем"
              />
            </div>
            <div>
              <UiLabel for="price_per_unit">Цена за единицу</UiLabel>
              <UiInput
                class="mt-2"
                id="price_per_unit"
                type="number"
                v-model="newPrepayment.price_per_unit"
                placeholder="Введите цену за единицу"
              />
            </div>
            <div>
              <UiLabel for="total_price">Стоимость</UiLabel>
              <UiInput
                class="mt-2"
                id="total_price"
                type="number"
                v-model="newPrepayment.total_price"
                placeholder="Введите общую стоимость"
              />
            </div>
            <div class="flex flex-col gap-2">
              <UiLabel for="contractor">Контрагент</UiLabel>
              <MyComboboxModels
                :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
                :label="'Выбрать'"
                @selected-item="(value) => newPrepayment.contractor = value"
              />
            </div>
          </div>
          <UiDialogFooter>
            <div class="flex justify-between w-full">
              <UiButton class="mb-2" @click="isDialogOpen = false"
                >Отмена</UiButton
              >
              <UiButton @click="createPrepayment">Создать</UiButton>
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

    <!-- Prepayments Table -->
    <div v-else>
      <UiTable>
        <UiTableCaption>Список предоплат.</UiTableCaption>
        <UiTableHeader class="bg-slate-100">
          <UiTableRow>
            <UiTableHead>Тип</UiTableHead>
            <UiTableHead>Контрагент</UiTableHead>
            <UiTableHead>Объем общий</UiTableHead>
            <UiTableHead>Объем</UiTableHead>
            <UiTableHead>Цена за ед.</UiTableHead>
            <UiTableHead>Стоимость</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow
            v-for="prepayment in prepayments"
            :key="prepayment.id"
            @click="router.push(`/prepayments/${prepayment.id}`)"
            class="cursor-pointer hover:bg-gray-100"
          >
            <UiTableCell>{{ prepayment.prepayment_type }}</UiTableCell>
            <UiTableCell>{{ prepayment.contractor_name }}</UiTableCell>
            <UiTableCell>{{ prepayment.total_volume }}</UiTableCell>
            <UiTableCell>{{ prepayment.remaining_volume }}</UiTableCell>
            <UiTableCell>{{ prepayment.price_per_unit }}</UiTableCell>
            <UiTableCell>{{ prepayment.total_price }}</UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
