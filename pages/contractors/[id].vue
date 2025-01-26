<script setup lang="ts">

const router = useRouter();
const route = useRoute();
useHead({
  title: 'Контрагент',
});

const contractorId = route.params.id;
const contractorForm = ref({
  name: '',
  phone: '',
  inn: '',
  contractor_type: '',
});
const contractorsTypes = ref([]);
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');

const contractorAddresses = ref([{
  address_type: '',
  address: '',
}]);
const isDialogOpen = ref(false);
const newAddress = ref({ address: '', address_type: '', contractor: contractorId, });


// Fetch contractor data on load
const fetchContractor = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/contractors/${contractorId}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const contractorData = await response.json();
    contractorForm.value = {
      name: contractorData.name || '',
      phone: contractorData.phone || '',
      inn: contractorData.inn || '',
      contractor_type: contractorData.contractor_type || '',
    };
    const res = await fetch('https://vm42106.vpsone.xyz/api/contractor-types/');
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    contractorsTypes.value = await res.json();
    await fetchAddresses()
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Update contractor data
const saveContractor = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/contractors/${contractorId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractorForm.value),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    successMessage.value = 'Контрагент успешно обновлён!';
    setTimeout(() => (successMessage.value = ''), 3000);
  } catch (err) {
    error.value = err.message;
  }
};

const deleteContractor = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/contractors/${contractorId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    console.log('Контрагент удалён!');
    router.push('/contractors');
  } catch (err) {
    console.error('Ошибка удаления контрагента:', err);
  }
};

const fetchAddresses = async () => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/contractor-addresses/?contractor=${contractorId}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    contractorAddresses.value = await response.json();
    console.log(contractorAddresses.value );
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const addAddress = async () => {
  try {
    const response = await fetch('https://vm42106.vpsone.xyz/api/contractor-addresses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAddress.value),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    // Добавляем нового контрагента в список
    const addedAddress = await response.json();
    contractorAddresses.value.push(addedAddress);

    // Закрываем модальное окно
    isDialogOpen.value = false;

    // Очищаем форму
    newAddress.value = { address: '', address_type: '', contractor: contractorId, };
  } catch (err) {
    console.error('Ошибка создания контрагента:', err);
  }
};

const deleteAddress = async (id: number) => {
  try {
    const response = await fetch(`https://vm42106.vpsone.xyz/api/contractor-addresses/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    // Remove the order from the list
    contractorAddresses.value = contractorAddresses.value.filter(address => address.id !== id);
  } catch (err) {
    console.error('Ошибка удаления адреса:', err);
  }
};

onMounted(fetchContractor);
</script>

<template>
  <div class="p-6">
    <div class="flex gap-3">
      <UiButton @click="router.push('/contractors')" class="h-8 w-8"> < </UiButton>
      <h1 class="text-2xl font-bold mb-4">Контрагент</h1>
    </div>

    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>Ошибка загрузки: {{ error }}</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div>
        <UiLabel for="name">Название</UiLabel>
        <UiInput
          class="mt-2"
          id="name"
          v-model="contractorForm.name"
          placeholder="Введите название контрагента"
        />
      </div>
      <div>
        <UiLabel for="phone">Телефон</UiLabel>
        <UiInput
          class="mt-2"
          id="phone"
          v-model="contractorForm.phone"
          placeholder="Введите номер телефона"
        />
      </div>
      <div>
        <UiLabel for="inn">ИНН</UiLabel>
        <UiInput
          class="mt-2"
          id="inn"
          v-model="contractorForm.inn"
          placeholder="Введите ИНН"
        />
      </div>
      <div>
        <UiLabel for="contractor_type">Тип контрагента</UiLabel>
        <MyCombobox
          class="mt-2"
          :items="contractorsTypes.map(type => type.name)"
          :label="contractorForm.contractor_type"
          @selected-item="(value)=> contractorForm.contractor_type = value"
        />
      </div>
      <div class="mt-4 flex justify-between">
        <UiButton @click.stop="deleteContractor">Удалить</UiButton>
        <UiButton @click="saveContractor">Сохранить</UiButton>
      </div>
      <p v-if="successMessage" class="text-green-500 mt-4">
        {{ successMessage }}
      </p>
    </div>
  </div>
  <UiSeparator label="" />
  <!-- АДРЕССА -->
  <div class="p-6">
    <div class="flex gap-3">
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton @click="isDialogOpen = true" class="h-8 w-8"> + </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Добавить адрес</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <div class="flex flex-col gap-3">
            <div>
              <UiLabel for="address">Адресс</UiLabel>
              <UiInput
                class="mt-2"
                id="address"
                v-model="newAddress.address"
                placeholder="Введите адресс контрагента"
              />
            </div>
            <div>
              <UiLabel for="address_type">Тип</UiLabel>
              <UiInput
                class="mt-2"
                id="address_type"
                v-model="newAddress.address_type"
                placeholder="Введите тип"
              />
            </div>
          </div>
          <UiDialogFooter>
            <div class="flex justify-between w-full">
              <UiButton class="mb-2" @click="isDialogOpen = false"
                >Отмена</UiButton
              >
              <UiButton @click="addAddress">Добавить</UiButton>
            </div>
          </UiDialogFooter>
        </UiDialogContent>
      </UiDialog>
      <h1 class="text-2xl font-bold mb-4">Адреса контрагента</h1>
    </div>
    <UiTable>
      <UiTableCaption>Список адрессов.</UiTableCaption>
      <UiTableHeader class="bg-slate-100">
        <UiTableRow>
          <UiTableHead>Тип</UiTableHead>
          <UiTableHead>Адресс</UiTableHead>
          <UiTableHead>Действия</UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow v-for="address in contractorAddresses" :key="address.id">
          <UiTableCell>{{ address.address_type }}</UiTableCell>
          <UiTableCell>{{ address.address }}</UiTableCell>
          <UiTableCell>
            <UiButton class="h-5 w-5 p-0" @click="deleteAddress(address.id)"
              >-</UiButton
            >
          </UiTableCell>
        </UiTableRow>
      </UiTableBody>
    </UiTable>
  </div>
  <UiSeparator label="" />
  <!-- ПРЕДОПЛАТЫ -->
</template>
