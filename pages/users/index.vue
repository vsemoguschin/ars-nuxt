<script setup lang="ts">
const { $useApi } = useNuxtApp();


const router = useRouter();
useHead({
  title: 'Пользователи',
});
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const isDialogOpen = ref(false);
const newUser = ref({ user_full_name: '', username: '', role: '', telegram_id: '' });

const fetchUsers = async () => {
  try {
    // const response = await fetch('https://faunaplus24.ru/api/users/');
    const { data } = await $useApi.get('/users/');
    users.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const createUser = async () => {
  try {
    const {data: createdUser} = await $useApi.post('/users/', newUser.value);

    users.value.push(createdUser);

    // Закрываем модальное окно
    isDialogOpen.value = false;

    // Очищаем форму
    newUser.value = { user_full_name: '', username: '', role: '', telegram_id: '' };
  } catch (err) {
    console.error('Ошибка создания пользователя:', err);
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Список пользователей</h1>

    <div class="flex gap-2 mb-4">
      <UiButton @click="router.push('/')" class="h-8 w-8"> < </UiButton>
      <UiDialog v-model:open="isDialogOpen">
        <UiDialogTrigger as-child>
          <UiButton @click="isDialogOpen = true" class="h-8 w-8"> + </UiButton>
        </UiDialogTrigger>
        <UiDialogContent>
          <UiDialogHeader>
            <UiDialogTitle>Создать пользователя</UiDialogTitle>
            <UiDialogDescription />
          </UiDialogHeader>
          <MyUsersUserForm
            :model-value="newUser"
            @update:modelValue="value => newUser = value"
          />
          <UiDialogFooter>
            <div class="flex justify-between w-full">
              <UiButton class="mb-2" @click="isDialogOpen = false"
                >Отмена</UiButton
              >
              <UiButton @click="createUser">Создать</UiButton>
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

    <!-- ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ -->
    <div v-else>
      <UiTable>
        <UiTableCaption>Список пользователей.</UiTableCaption>
        <UiTableHeader class="bg-slate-100">
          <UiTableRow>
            <UiTableHead>Имя</UiTableHead>
            <UiTableHead>Фамилия</UiTableHead>
            <UiTableHead>Роль</UiTableHead>
            <UiTableHead>TG ID</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow
            v-for="user in users"
            :key="user.id"
            @click="router.push(`/users/${user.id}`)"
            class="cursor-pointer hover:bg-gray-100"
          >
            <UiTableCell>{{ user.username }}</UiTableCell>
            <UiTableCell>{{ user.user_full_name }}</UiTableCell>
            <UiTableCell>{{ user.role }}</UiTableCell>
            <UiTableCell>{{ user.telegram_id }}</UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
