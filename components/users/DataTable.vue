<template>
    <Table>
      <Thead>
        <Tr>
          <Th v-for="header in table.getHeaderGroups()[0].headers" :key="header.id">
            {{ header.column.columnDef.header }}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr v-for="row in table.getRowModel().rows" :key="row.id">
          <Td v-for="cell in row.getVisibleCells()" :key="cell.id">
            {{ cell.getValue() }}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  </template>
  
  <script setup lang="ts">
  import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table';
  import { useTable } from '@tanstack/vue-table';
  import { columns } from './columns';
  import type { User } from './columns';
  
  const props = defineProps({
    data: {
      type: Array as () => User[],
      required: true,
    },
  });
  
  const table = useTable({
    columns,
    data: props.data,
  });
  </script>
  