<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type DateValue,
  fromDate,
  getLocalTimeZone,
} from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import { formatDate } from "@vueuse/core";

interface Props {
  getValue: any;
  table: any;
  row: any;
  column: any;
}

const props = defineProps<Props>();

const initialValue = props.getValue()
  ? fromDate(new Date(props.getValue()), getLocalTimeZone())
  : undefined;

const value = ref<DateValue | undefined>(initialValue);
const isLoading = ref<boolean>(props.table.options.meta?.isLoading);

const isPopoverOpen = ref<boolean>(false);

const handlePopoverState = (open: boolean) => {
  isPopoverOpen.value = open;

  if (!open) {
    if (isLoading.value) return;
    const updatedValue = value.value;
    if (updatedValue) {
      const oldValue = new Date(props.row.original.due_date);
      const newValue = updatedValue.toDate(getLocalTimeZone());

      if (newValue !== oldValue) {
        props.table.options.meta?.updateData(
          props.row,
          props.column.id,
          newValue.toISOString()
        );
      }
    }
  }
};
</script>

<template>
  <Popover :open="isPopoverOpen" @update:open="handlePopoverState">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :disabled="isLoading"
        :class="
          cn(
            'w-52 justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{
          value
            ? formatDate(value.toDate(getLocalTimeZone()), "ddd, MMM DD, YYYY")
            : "Pick a date"
        }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <CustomCalendar v-model="value" initial-focus />
    </PopoverContent>
  </Popover>
</template>
