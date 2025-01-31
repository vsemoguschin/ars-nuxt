<script lang="ts" setup>
const router = useRouter();
defineProps({
    orders: {
        type: Array,
        required: true,
    }
})
</script>

<template>
  <UiTable>
    <UiTableCaption>Список заказов.</UiTableCaption>
    <UiTableHeader class="bg-slate-100">
      <UiTableRow>
        <UiTableHead>Тип</UiTableHead>
        <UiTableHead>Дата</UiTableHead>
        <UiTableHead>Клиент</UiTableHead>
        <UiTableHead>Адрес</UiTableHead>
        <UiTableHead>Поставщик</UiTableHead>
        <UiTableHead>Тип транспорта</UiTableHead>
        <UiTableHead>Общий объем</UiTableHead>
        <UiTableHead>Объем материала</UiTableHead>
      </UiTableRow>
    </UiTableHeader>
    <UiTableBody>
      <UiTableRow
        v-for="order in orders"
        :key="order.id"
        @click="router.push(`/orders/${order.id}`)"
        class="cursor-pointer hover:bg-gray-100"
      >
        <UiTableCell>{{ order.order_type }}</UiTableCell>
        <UiTableCell>{{ order.order_date }}</UiTableCell>
        <UiTableCell>{{ order.client_info.name }}</UiTableCell>
        <UiTableCell
          >{{ order?.client_address_info?.address || ''}}</UiTableCell
        >
        <UiTableCell>{{ order.supplier }}</UiTableCell>
        <UiTableCell>{{ order.vehicle_type }}</UiTableCell>
        <UiTableCell>{{ order.total_handled_volume }}</UiTableCell>
        <UiTableCell>{{ order.material_volume }}</UiTableCell>
      </UiTableRow>
    </UiTableBody>
  </UiTable>
</template>

<style></style>
