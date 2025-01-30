<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
useHead({
  title: 'Авторизация',
});

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch('https://faunaplus24.ru/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!response.ok) throw new Error('Неверное имя пользователя или пароль');

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    router.push('/');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-center">Авторизация</h1>

    <div v-if="loading" class="text-center">
      <p>Загрузка...</p>
    </div>

    <div v-else>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div>
          <UiLabel for="username">Имя пользователя</UiLabel>
          <UiInput
            id="username"
            v-model="username"
            placeholder="Введите имя пользователя"
          />
        </div>
        <div>
          <UiLabel for="password">Пароль</UiLabel>
          <UiInput
            id="password"
            v-model="password"
            type="password"
            placeholder="Введите пароль"
          />
        </div>
        <div v-if="error" class="text-red-500 text-center">
          <p>{{ error }}</p>
        </div>
        <UiButton type="submit" class="w-full">Войти</UiButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
.p-6 {
  max-width: 400px;
  margin: auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
