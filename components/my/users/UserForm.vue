<script setup lang="ts">

// Props and emits
const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const userForm = ref({
  username: props.modelValue.username || '',
  user_full_name: props.modelValue.user_full_name || '',
  role: props.modelValue.role || 'user', // Default role set to 'user'
  telegram_id: props.modelValue.telegram_id || '',
});


// Watch for changes in userForm and emit update:modelValue
watch(userForm, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });
</script>

<template>
  <div class="flex flex-col gap-3">
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
            <UiSelectItem value="subcontracter">Подрядчик</UiSelectItem>
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
  </div>
</template>
