<script setup lang="ts">
import { MoreHorizontal, View, Trash } from "lucide-vue-next";

interface Props {
  table: any;
  row: any;
}
const props = defineProps<Props>();
const isLoading = ref<boolean>(props.table.options.meta?.isLoading);

const handleRemove = () => {
  if (isLoading.value) return;

  props.table.options.meta?.deleteRow(props.row);
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="handleRemove">
        <Trash class="w-4 h-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
