<script setup lang="ts">

const router = useRouter();
useHead({
  title: 'Контрагенты',
});
const contractors = ref([]);
const contractorsTypes = ref([]);
const loading = ref(true);
const error = ref(null);
const isDialogOpen = ref(false);
const newContractor = ref({ name: '', phone: '', inn: '', contractor_type: 'test' });

const fetchContractors = async () => {
    try {
        const response = await fetch('https://vm42106.vpsone.xyz/api/contractors/');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        contractors.value = await response.json();

        const res = await fetch('https://vm42106.vpsone.xyz/api/contractor-types/');
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        contractorsTypes.value = await res.json();
        console.log(contractorsTypes.value);
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const createContractor = async () => {
  try {
    const response = await fetch('https://vm42106.vpsone.xyz/api/contractors/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContractor.value),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    // Добавляем нового контрагента в список
    const createdContractor = await response.json();
    contractors.value.push(createdContractor);

    // Закрываем модальное окно
    isDialogOpen.value = false;

    // Очищаем форму
    newContractor.value = { name: '', phone: '', inn: '', contractor_type: 1 };
  } catch (err) {
    console.error('Ошибка создания контрагента:', err);
  }
};

onMounted(fetchContractors);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Список контрагентов</h1>

    <div class="flex gap-2 mb-4">
      <UiButton @click="router.push('/')" class="h-8 w-8"> < </UiButton>
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton @click="isDialogOpen = true" class="h-8 w-8"> + </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Создать контрагента</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <div class="flex flex-col gap-3">
            <div>
              <UiLabel for="name">Название</UiLabel>
              <UiInput
                class="mt-2"
                id="name"
                v-model="newContractor.name"
                placeholder="Введите название контрагента"
              />
            </div>
            <div>
              <UiLabel for="phone">Телефон</UiLabel>
              <UiInput
                class="mt-2"
                id="phone"
                v-model="newContractor.phone"
                placeholder="Введите номер телефона"
              />
            </div>
            <div>
              <UiLabel for="inn">ИНН</UiLabel>
              <UiInput
                class="mt-2"
                type="number"
                id="inn"
                v-model="newContractor.inn"
                placeholder="Введите ИНН"
              />
            </div>
            <div>
              <UiLabel for="contractor_type">Тип контрагента</UiLabel>
              <MyCombobox
                class="mt-2"
                :items="contractorsTypes.map(type => type.name)"
                :label="'Тип контрагента'"
                @selected-item="(value)=> newContractor.contractor_type = value"
              />
            </div>
          </div>
          <UiDialogFooter>
            <div class="flex justify-between w-full">
              <UiButton class="mb-2" @click="isDialogOpen = false"
                >Отмена</UiButton
              >
              <UiButton @click="createContractor">Создать</UiButton>
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

    <!-- ТАБЛИЦА КОНТРАГЕНТОВ -->
    <div v-else>
      <UiTable>
        <UiTableCaption>Список контрагентов.</UiTableCaption>
        <UiTableHeader class="bg-slate-100">
          <UiTableRow>
            <UiTableHead>Название</UiTableHead>
            <UiTableHead>Телефон</UiTableHead>
            <UiTableHead>ИНН</UiTableHead>
            <UiTableHead>Тип</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow
            v-for="contractor in contractors"
            :key="contractor.id"
            @click="router.push(`/contractors/${contractor.id}`)"
            class="cursor-pointer hover:bg-gray-100"
          >
            <UiTableCell>{{ contractor.name }}</UiTableCell>
            <UiTableCell>{{ contractor.phone }}</UiTableCell>
            <UiTableCell>{{ contractor.inn }}</UiTableCell>
            <UiTableCell>{{ contractor.contractor_type }}</UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
