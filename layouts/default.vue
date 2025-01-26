<template>
    <div>
      <main>
        <!-- Используем NuxtPage для интеграции страниц -->
        <NuxtPage />
      </main>
    </div>
  </template>
  
  <script setup>
//   import { onMounted } from 'vue';
  
//   onMounted(() => {
//     const script = document.createElement('script');
//     script.src = 'https://telegram.org/js/telegram-web-app.js?56';
//     script.async = true;
//     script.onload = () => {
//       const webApp = window.Telegram.WebApp;
//       if (webApp) {
//         console.log('Telegram WebApp initialized');
//         webApp.ready(); // Inform Telegram the app is ready
//         console.log('Theme:', webApp.themeParams);
//         console.log('Platform:', webApp.platform);
//         // Set custom styles based on theme
//         document.body.style.backgroundColor = webApp.themeParams.bg_color || '#ffffff';
//       } else {
//         console.error('Failed to initialize Telegram WebApp.');
//       }
//     };
//     document.head.appendChild(script);
//   });
  </script>
  
  <style>
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  </style>
  