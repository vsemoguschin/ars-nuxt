<script lang='ts' setup>

</script>

<template>
<div class="flex flex-col gap-3">
    <div>
      <UiLabel for="order_type">Тип заказа</UiLabel>
      <MyCombobox
        class="mt-2"
        :items="orderTypes.map(type => type.name)"
        :label="'Выберите тип заказа'"
        @selected-item="(value) => newOrder.order_type = value"
      />
    </div>
    <div>
      <UiLabel for="order_date">Дата заказа</UiLabel>
      <UiInput
        class="mt-2"
        id="order_date"
        type="date"
        v-model="newOrder.order_date"
      />
    </div>
    <div class="flex flex-col gap-2">
      <UiLabel for="client">Клиент</UiLabel>
      <MyComboboxModels
        :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
        :label="'Выберите клиента'"
        @selected-item="async(value) => { newOrder.client = value; await fetchAddresses(newOrder.client); }"
      />
    </div>
    <div class="flex flex-col gap-2">
      <UiLabel for="client_address">Адрес клиента</UiLabel>
      <MyComboboxModels
        v-if="newOrder.client !== 0"
        :items="clientAddresses.map(address => ({ value: address.id, label: address.address }))"
        :label="'Выберите адрес клиента'"
        @selected-item="(value) => newOrder.client_address = value"
      />
      <UiInput
        v-else
        class="mt-2"
        placeholder="Выберите адрес клиента"
        disabled
      />
    </div>
    <div class="flex flex-col gap-2">
      <UiLabel for="supplier">Поставщик</UiLabel>
      <MyComboboxModels
        :items="contractors.map(contractor => ({ value: contractor.id, label: contractor.name }))"
        :label="'Выберите поставщика'"
        @selected-item="(value) => newOrder.supplier = value"
      />
    </div>
    <div>
      <UiLabel for="vehicle_type">Тип ТС</UiLabel>
      <MyCombobox
        class="mt-2"
        :items="vehicleTypes.map(type => type.name)"
        :label="'Выберите тип ТС'"
        @selected-item="(value) => newOrder.vehicle_type = value"
      />
    </div>
    <div>
      <UiLabel for="unit">Единица измерения</UiLabel>
      <UiSelect v-model="newOrder.unit">
        <UiSelectTrigger>
          <UiSelectValue placeholder="Выберите единицу" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem value="m3">м³</UiSelectItem>
          <UiSelectItem value="ton">Тонны</UiSelectItem>
        </UiSelectContent>
      </UiSelect>
    </div>
    <div>
      <UiLabel for="material_volume">Объем материала</UiLabel>
      <UiInput
        class="mt-2"
        id="material_volume"
        type="number"
        v-model="newOrder.material_volume"
        placeholder="Введите объем материала"
      />
    </div>
    <div class="flex justify-between w-full">
      <UiButton class="mb-2">Отмена</UiButton>
      <UiButton @click="createOrder">Создать</UiButton>
    </div>
  </div>
</template>

<style>

</style>