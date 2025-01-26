<script lang="ts" setup>
const router = useRouter();

defineProps({
    orders: {
        type: Object,
        requared: true,
    }
});
</script>

<template>
  <UiTable>
    <UiTableCaption>Список заказов.</UiTableCaption>
    <UiTableHeader class="bg-slate-100">
      <UiTableRow>
        <UiTableHead>Тип заказа</UiTableHead>
        <UiTableHead>Дата заказа</UiTableHead>
        <UiTableHead>Контрагент</UiTableHead>
        <UiTableHead>Подрядчик</UiTableHead>
        <UiTableHead>ТС</UiTableHead>
        <UiTableHead>Объем</UiTableHead>
        <UiTableHead>Статус</UiTableHead>
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
        <UiTableCell>{{ order.supplier_info.name }}</UiTableCell>
        <UiTableCell>{{ order.vehicle_type }}</UiTableCell>
        <UiTableCell>{{ order.material_volume }}</UiTableCell>
        <UiTableCell>{{ order.status }}</UiTableCell>
      </UiTableRow>
    </UiTableBody>
  </UiTable>
</template>

<style></style>
