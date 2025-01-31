<script setup>
useHead({
  title: 'CRM',
});

const links = [
  // { name: 'Пользователи', path: '/users' },
  { name: 'Контрагенты', path: '/contractors' },
  { name: 'Транспортные средства', path: '/vehicles' },
  { name: 'Предоплаты', path: '/prepayments' },
  { name: 'Заявки', path: '/orders' },
];

// Функция выхода
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/auth'; // Перенаправляем на страницу авторизации
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-2xl font-bold mb-6">МЕНЮ</h1>
    <div class="flex flex-col gap-4">
      <!-- Кнопки навигации -->
      <UiButton
        v-for="link in links"
        :key="link.name"
        :as="'a'"
        :href="link.path"
        class="w-full"
      >
        {{ link.name }}
      </UiButton>

      <!-- Кнопка Выход -->
      <UiButton
        @click="handleLogout"
        class="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        Выйти
      </UiButton>
    </div>
  </div>
</template>

<style></style>
