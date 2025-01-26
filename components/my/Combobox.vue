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
const newItem = ref<string>('')
const check = (e: any) => {
    newItem.value = e.target.value;
    return
}

const emit = defineEmits(['selectedItem']);

const selectedItem = (value: string) => {
    // console.log(value);
    emit('selectedItem', value);
    return
}
</script>

<template>
  <div>
    <UiPopover v-model:open="open">
      <UiPopoverTrigger as-child>
        <div>
          <UiButton
            variant="outline"
            role="combobox"
            :aria-expanded="open"
            class="w-full justify-between"
          >
            {{ value ? value : `${label}...` }}
            <!-- <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" /> -->
          </UiButton>
        </div>
      </UiPopoverTrigger>
      <UiPopoverContent class="p-0">
        <UiCommand>
          <UiCommandInput
            @input="check"
            class="h-9"
            placeholder="Найти или ввести..."
          />
          <UiCommandList>
            <UiCommandGroup>
              <UiCommandItem
                v-for="item in items"
                :key="item"
                :value="item"
                @select="(ev) => {
                                if (typeof ev.detail.value === 'string') {
                                    value = ev.detail.value
                                }
                                open = false
                                selectedItem(value)
                            }"
              >
                {{ item }}
                <!-- <Check
                  :class="cn(
                                    'ml-auto h-4 w-4',
                                    value === item ? 'opacity-100' : 'opacity-0',
                                )"
                /> -->
              </UiCommandItem>
              <UiCommandItem
                v-if="newItem !== ''"
                :key="newItem"
                :value="newItem"
                @select="(ev) => {
                                if (typeof ev.detail.value === 'string') {
                                    value = ev.detail.value
                                }
                                open = false
                                selectedItem(value)
                            }"
              >
                {{ newItem }}
                <!-- <Check
                  :class="cn(
                                    'ml-auto h-4 w-4',
                                    value === newItem ? 'opacity-100' : 'opacity-0',
                                )"
                /> -->
              </UiCommandItem>
            </UiCommandGroup>
          </UiCommandList>
        </UiCommand>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>
