<script setup>
useHead({
  title: 'CRM',
});
const links = [
  { name: 'Пользователи', path: '/users' },
  { name: 'Контрагенты', path: '/contractors' },
  { name: 'Транспортные средства', path: '/vehicles' },
  { name: 'Предоплаты', path: '/prepayments' },
  { name: 'Заявки', path: '/orders' },
];
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen bg-gray-100 "
  >
    <h1 class="text-2xl font-bold mb-6">МЕНЮ</h1>
    <div class="flex flex-col gap-4">
      <UiButton
        v-for="link in links"
        :key="link.name"
        :as="'a'"
        :href="link.path"
        class="w-full"
      >
        {{ link.name }}
      </UiButton>
    </div>
  </div>
</template>

<style></style>
