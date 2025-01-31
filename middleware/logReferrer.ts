export default defineNuxtRouteMiddleware((to, from) => {
  const referer = useRequestHeaders(["referer"]).referer || "csacdc";
  console.log("Пользователь перешел с:", referer);
});
