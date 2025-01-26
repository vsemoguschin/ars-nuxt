<script setup lang="ts">
const router = useRouter();
const route = useRoute();
useHead({
  title: 'Предоплата',
});

const prepaymentId = route.params.id;
const prepaymentForm = ref({
  prepayment_type: '',
  unit: 'm3',
  total_volume: 0,
  remaining_volume: 0,
  price_per_unit: 0,
  total_price: 0,
  contractor: 0,
});
const prepaymentTypes = ref([]);
const contractors = ref([]);
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');

// Fetch prepayment data on load
const fetchPrepayment = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/prepayments/${prepaymentId}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const prepaymentData = await response.json();
    prepaymentForm.value = {
      prepayment_type: prepaymentData.prepayment_type || '',
      unit: prepaymentData.unit || 'm3',
      total_volume: prepaymentData.total_volume || 0,
      remaining_volume: prepaymentData.remaining_volume || 0,
      price_per_unit: prepaymentData.price_per_unit || 0,
      total_price: prepaymentData.total_price || 0,
      contractor: prepaymentData.contractor || 0,
    };

    const typesResponse = await fetch('https://vm42106.vpsone.xyz/api/prepayment-types/');
    if (!typesResponse.ok) throw new Error(`HTTP Error: ${typesResponse.status}`);
    prepaymentTypes.value = await typesResponse.json();

    const contractorsResponse = await fetch('https://vm42106.vpsone.xyz/api/contractors/');
    if (!contractorsResponse.ok) throw new Error(`HTTP Error: ${contractorsResponse.status}`);
    contractors.value = await contractorsResponse.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Update prepayment data
const savePrepayment = async () => {
  try {
    console.log(prepaymentForm.value.contractor);
    const response = await fetch(`https://vm42106.vpsone.xyz/api/prepayments/${prepaymentId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepaymentForm.value),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    successMessage.value = 'Авансовый платеж успешно обновлён!';
    setTimeout(() => (successMessage.value = ''), 3000);
  } catch (err) {
    error.value = err.message;
  }
};

const deletePrepayment = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/prepayments/${prepaymentId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    console.log('Авансовый платеж удалён!');
    router.push('/prepayments');
  } catch (err) {
    console.error('Ошибка удаления авансового платежа:', err);
  }
};

onMounted(fetchPrepayment);
</script>

<template>
  <div>
    <div class="p-6">
      <div class="flex gap-3">
        <UiButton @click="router.push('/prepayments')" class="h-8 w-8">
          <
        </UiButton>
        <h1 class="text-2xl font-bold mb-4">Предоплата</h1>
      </div>
  
      <div v-if="loading" class="text-center">
        <p>Загрузка...</p>
      </div>
  
      <div v-else-if="error" class="text-red-500 text-center">
        <p>Ошибка загрузки: {{ error }}</p>
      </div>
  
      <div v-else class="flex flex-col gap-3">
        <div>
          <UiLabel for="prepayment_type">Тип авансового платежа</UiLabel>
          <MyCombobox
            class="mt-2"
            :items="prepaymentTypes.map(type => type.name)"
            :label="prepaymentForm.prepayment_type"
            @selected-item="(value) => prepaymentForm.prepayment_type = value"
          />
        </div>
        <div>
          <UiLabel for="unit">Единица измерения</UiLabel>
          <UiSelect v-model="prepaymentForm.unit">
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
          <UiLabel for="total_volume">Общий объем</UiLabel>
          <UiInput
            class="mt-2"
            id="total_volume"
            type="number"
            v-model="prepaymentForm.total_volume"
            placeholder="Введите общий объем"
          />
        </div>
        <div>
          <UiLabel for="remaining_volume">Оставшийся объем</UiLabel>
          <UiInput
            class="mt-2"
            id="remaining_volume"
            type="number"
            v-model="prepaymentForm.remaining_volume"
            placeholder="Введите оставшийся объем"
          />
        </div>
        <div>
          <UiLabel for="price_per_unit">Цена за единицу</UiLabel>
          <UiInput
            class="mt-2"
            id="price_per_unit"
            type="number"
            v-model="prepaymentForm.price_per_unit"
            placeholder="Введите цену за единицу"
          />
        </div>
        <div>
          <UiLabel for="total_price">Общая стоимость</UiLabel>
          <UiInput
            class="mt-2"
            id="total_price"
            type="number"
            v-model="prepaymentForm.total_price"
            placeholder="Введите общую стоимость"
          />
        </div>
        <div class="flex flex-col gap-3">
          <UiLabel for="contractor">Контрагент</UiLabel>
          <MyComboboxModels
            :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
            :label="contractors.find(c=>c.id===prepaymentForm.contractor).name"
            @selected-item="(value) => prepaymentForm.contractor = value"
          />
        </div>
        <div class="mt-4 flex justify-between">
          <UiButton @click.stop="deletePrepayment">Удалить</UiButton>
          <UiButton @click="savePrepayment">Сохранить</UiButton>
        </div>
        <p v-if="successMessage" class="text-green-500 mt-4">
          {{ successMessage }}
        </p>
      </div>
    </div>
    <UiSeparator/>
  </div>
</template>
