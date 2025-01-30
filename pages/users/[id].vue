<script setup lang="ts">
const { $useApi } = useNuxtApp();

const router = useRouter();
const route = useRoute();
useHead({
  title: 'Профиль',
});

const userId = route.params.id;
const userForm = ref({
  username: '',
  user_full_name: '',
  role: 'user',
  telegram_id: '',
});
const loading = ref(true);
const error = ref(null);
const successMessage = ref('');

// Fetch user data on load
const fetchUser = async () => {
  try {
    const {data:user} = await $useApi.get(`/users/${userId}/`);

    const userData = user;
    userForm.value = {
      username: userData.username || '',
      user_full_name: userData.user_full_name || '',
      role: userData.role || 'user',
      telegram_id: userData.telegram_id || '',
    };
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Update user data
const saveUser = async () => {
  try {
    const {data} = await $useApi.patch(`/users/${userId}/`, userForm.value);
    console.log(data);

    successMessage.value = 'Пользователь успешно обновлён!';
    setTimeout(() => (successMessage.value = ''), 3000); // Очистка сообщения через 3 секунды
  } catch (err) {
    error.value = err.message;
  }
};

const deleteUser = async () => {
  try {
    const response = await $useApi.delete(`/users/${userId}/`);
    console.log('пользователь удален!');
    
  } catch (err) {
    console.error('Ошибка удаления пользователя:', err);
  }
};

onMounted(fetchUser);
</script>

<template>
  <div class="p-6 ">
    <div class="flex gap-3">
      <UiButton @click="router.push('/users')" class="h-8 w-8"> < </UiButton>

      <h1 class="text-2xl font-bold mb-4">Профиль</h1>
    </div>

    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>Ошибка загрузки: {{ error }}</p>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div>
        <UiLabel for="username">Имя</UiLabel>
        <UiInput
          class="mt-2"
          id="username"
          v-model="userForm.username"
          placeholder="Введите имя"
        />
      </div>
      <div>
        <UiLabel for="user_full_name">Фамилия</UiLabel>
        <UiInput
          class="mt-2"
          id="user_full_name"
          v-model="userForm.user_full_name"
          placeholder="Введите фамилию"
        />
      </div>
      <div>
        <UiLabel for="role">Роль</UiLabel>
        <UiSelect v-model="userForm.role">
          <UiSelectTrigger>
            <UiSelectValue placeholder="Выберите роль" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem value="admin">Администратор</UiSelectItem>
              <UiSelectItem value="user">Пользователь</UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div>
        <UiLabel for="telegram_id">TG ID</UiLabel>
        <UiInput
          class="mt-2"
          id="telegram_id"
          v-model="userForm.telegram_id"
          placeholder="Введите TG ID"
        />
      </div>
      <div class="mt-4 flex justify-between">
        <UiButton @click.stop="deleteUser()">Удалить</UiButton>
        <UiButton @click="saveUser">Сохранить</UiButton>
      </div>
      <p v-if="successMessage" class="text-green-500 mt-4">
        {{ successMessage }}
      </p>
    </div>
  </div>
</template>
