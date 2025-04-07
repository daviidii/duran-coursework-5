<script setup lang="ts">
interface Props {
  table: any;
}

const props = defineProps<Props>();
</script>
<template>
  <Button
    variant="ghost"
    class="w-full"
    @click="props.table.options.meta?.addRow()"
    >Add new task</Button
  >
</template>
