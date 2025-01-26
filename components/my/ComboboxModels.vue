<script setup lang="ts">
// import { Check, ChevronsUpDown } from 'lucide-vue-next'

import { cn } from '@/lib//utils'

interface Props {
    items: string[];
    label: string;
}

defineProps<Props>();

const open = ref(false)
const value = ref('');

const emit = defineEmits(['selectedItem']);

const selectedItem = (value: number) => {
  emit('selectedItem', value);
  return
};
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="justify-between"
      >
        {{ value ? value : `${label}...` }}

        <!-- <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" /> -->
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="p-0">
      <UiCommand v-model="value">
        <UiCommandInput placeholder="Search item..." />
        <UiCommandEmpty>No item found.</UiCommandEmpty>
        <UiCommandList>
          <UiCommandGroup>
            <UiCommandItem
              v-for="item in items"
              :key="item.value"
              :value="item.label"
              @select="selectedItem(item.value); open = false;"
            >
              <!-- <Check
                :class="cn(
                  'mr-2 h-4 w-4',
                  value === item.value ? 'opacity-100' : 'opacity-0',
                )"
              /> -->
              {{ item.label }}
            </UiCommandItem>
          </UiCommandGroup>
        </UiCommandList>
      </UiCommand>
    </UiPopoverContent>
  </UiPopover>
</template>
