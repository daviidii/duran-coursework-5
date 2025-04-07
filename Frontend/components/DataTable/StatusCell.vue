<script setup lang="ts">
import type { ButtonVariants } from "~/types/types";

interface Props {
  options: string[];
  getValue: any;
  table: any;
  row: any;
  column: any;
}
const props = defineProps<Props>();
const selected = ref<string>(props.getValue());
const isLoading = ref<boolean>(props.table.options.meta?.isLoading);

const handleSelect = (option: string) => {
  if (isLoading.value) return;
  props.table.options.meta?.updateData(props.row, props.column.id, option);
  selected.value = option;
};
const variant = computed<ButtonVariants>(() => {
  const variant: Record<string, ButtonVariants> = {
    Pending: "warning",
    Completed: "success",
  };

  return variant[selected.value] || "default";
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button :disabled="isLoading" :variant="variant" size="sm">
        {{ selected }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Status</DropdownMenuLabel>
      <DropdownMenuItem
        v-for="(option, index) in props.options"
        :key="index"
        @click="handleSelect(option)"
      >
        <span>{{ option }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
