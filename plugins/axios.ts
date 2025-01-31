import { defineNuxtPlugin, useRuntimeConfig, useRouter } from "nuxt/app";
import axios, { AxiosError } from "axios";

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const baseURL = "https://faunaplus24.ru/api/";
  const useApi = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Логирование ошибок
  function handleError(error: AxiosError) {
    console.error("Произошла ошибка:", error);
    if (error.response) {
      console.error("Статус ошибки:", error.response.status);
      console.error("Данные ошибки:", error.response.data);
    } else if (error.request) {
      console.error("Нет ответа от сервера:", error.request);
    } else {
      console.error("Ошибка при настройке запроса:", error.message);
    }
  }

  // Перехватчик запросов: добавляем токен
  useApi.interceptors.request.use(
    request => {
      // console.log("Отправляем запрос:", request);
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      } else {
        console.warn("Токен отсутствует. Перенаправление на страницу входа.");
        router.push("/login");
      }
      return request;
    },
    error => {
      handleError(error);
      return Promise.reject(error);
    }
  );

  // Перехватчик ответов: обработка 401 и обновление токена
  useApi.interceptors.response.use(
    response => {
      // console.log("Получен ответ:", response);
      return response;
    },
    async error => {
      handleError(error);
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const { data } = await axios.post(
            `${baseURL}/auth/refresh/`,
            {refreshToken},
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refreshToken);
          return useApi(originalRequest); // Повторяем запрос с новым токеном
        } catch (refreshError) {
          handleError(refreshError as AxiosError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          router.push("/login");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  nuxtApp.provide("useApi", useApi);
});

// Объявление типа для TypeScript
declare module "nuxt/app" {
  interface NuxtApp {
    $useApi: typeof axios;
  }
}
