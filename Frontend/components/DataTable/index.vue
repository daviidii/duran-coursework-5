<script setup lang="ts" generic="TValue">
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
} from "@tanstack/vue-table";
import { formatDate } from "@vueuse/core";
import { useToast } from "../ui/toast";
import type { TaskProps } from "~/types/types";

import { valueUpdater } from "~/lib/utils";

const props = defineProps<{
  columns: ColumnDef<TaskProps, TValue>[];
  data: TaskProps[];
}>();

const { toast } = useToast();

const isLoading = ref<boolean>(false);
const editedRowId = ref<number | null>(null);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);

const emit = defineEmits<{
  (event: "deleteRow", rowId: number): void;
  (event: "addRow", newTask: TaskProps): void;
  (event: "updateRow", data: TaskProps[]): void;
}>();

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
  },

  meta: {
    isLoading,
    editedRowId,
    addRow: async () => {
      const newTask: Partial<TaskProps> = {
        title: "New task",
        description: "",
        status: "Pending",
        due_date: null,
      };
      try {
        const data = await $fetch<TaskProps>("http://localhost:5000/tasks", {
          method: "post",
          body: newTask,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        emit("addRow", data);
      } catch (error: any) {
        const errMessage = error.data
          ? error.data.error
          : "something went wrong";
        console.error("error >>>", errMessage);
        toast({
          title: `Failed to add new task`,
          description: h("div", { class: "space-y-1 text-foreground" }, [
            h("p", { class: "text-sm" }, `${errMessage}`),
            h(
              "p",
              {},
              `${formatDate(new Date(), "dddd, MMMM DD, YYYY - h:mm:ss a")}`
            ),
          ]),
          variant: "destructive",
        });
      }
    },
    updateData: async (row: any, columnId: string, value: any) => {
      if (value === row.original[columnId]) {
        return;
      }

      isLoading.value = true;
      editedRowId.value = row.index;

      try {
        await $fetch(`http://localhost:5000/tasks/${row.original._id}`, {
          method: "PUT",
          body: {
            [columnId]: value,
          },
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        // Create a new object for the updated task
        const updatedTask = { ...row.original, [columnId]: value };

        const updatedData = props.data.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );

        emit("updateRow", updatedData);

        setTimeout(() => {
          toast({
            title: `${row.original.title} ${columnId.replaceAll(
              "_",
              " "
            )} has been updated`,
            description: `${formatDate(
              new Date(),
              "dddd, MMMM DD, YYYY - h:mm:ss a"
            )}`,
            class: "bg-green-600",
          });
        }, 1000);
      } catch (error: any) {
        const errMessage = error.data
          ? error.data.error
          : "something went wrong";
        console.error("error >>>", errMessage);
        toast({
          title: `Failed to update ${columnId} of ${row.original.title} `,
          description: h("div", { class: "space-y-1 text-foreground" }, [
            h("p", { class: "text-sm" }, `${errMessage}`),
            h(
              "p",
              {},
              `${formatDate(new Date(), "dddd, MMMM DD, YYYY - h:mm:ss a")}`
            ),
          ]),
          variant: "destructive",
        });
      } finally {
        setTimeout(() => {
          isLoading.value = false;
          editedRowId.value = null;
        }, 1000);
      }
    },

    deleteRow: async (row: any) => {
      if (!row.original._id) return;

      isLoading.value = true;
      editedRowId.value = row.index;

      try {
        const rowId = row.original._id;

        if (rowId) {
          await $fetch(`http://localhost:5000/tasks/${rowId}`, {
            method: "delete",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          emit("deleteRow", rowId);

          setTimeout(() => {
            toast({
              title: `${row.original.title} has been deleted`,
              description: `${formatDate(
                new Date(),
                "dddd, MMMM DD, YYYY - h:mm:ss a"
              )}`,
              class: "bg-green-600",
            });
          }, 1000);
        }
      } catch (error: any) {
        const errMessage = error.data
          ? error.data.error
          : "something went wrong";
        console.error("error >>>", errMessage);
        toast({
          title: `Failed to delete ${row.original.title}`,
          description: h("div", { class: "space-y-1 text-foreground" }, [
            h("p", { class: "text-sm" }, `${errMessage}`),
            h(
              "p",
              {},
              `${formatDate(new Date(), "dddd, MMMM DD, YYYY - h:mm:ss a")}`
            ),
          ]),
          variant: "destructive",
        });
      } finally {
        setTimeout(() => {
          isLoading.value = false;
          editedRowId.value = null;
        }, 1000);
      }
    },
  },
});

watch(
  () => props.data,
  (newData, oldData) => {
    // Check if any individual element has changed
    const hasChanged = newData.some((task, index) => task !== oldData[index]);

    if (hasChanged) {
      // Reset sorting to ensure the table is re-sorted

      table.resetSorting();
      table.setSorting(sorting.value);
    }
  },
  { deep: true } // Enable deep watching
);
</script>

<template>
  <div
    class="border rounded-lg overflow-hidden"
    :class="[isLoading ? '!cursor-wait' : '']"
  >
    <div class="flex items-center justify-between px-5 py-4 border-b">
      <h2
        class="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Todo
      </h2>
      <Input
        class="max-w-sm"
        placeholder="Filter titles"
        :model-value="table.getColumn('title')?.getFilterValue() as string"
        @update:model-value="table.getColumn('title')?.setFilterValue($event)"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow
          class="m-0 p-0 even:bg-muted"
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-4 py-3 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
            :class="[
              header.column.id === 'title'
                ? 'w-64'
                : header.column.id === 'description'
                ? 'w-[600px]'
                : '',
            ]"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody :class="[isLoading ? 'pointer-events-none' : '']">
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.original._id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            class="m-0 border-t p-0 even:bg-muted/20"
            :class="[
              editedRowId === row.index ? 'animate-pulse bg-accent/40' : '',
            ]"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-4 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-14 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
      <TableFooter class="text-center bg-background hover:bg-background">
        <TableRow class="hover:bg-transparent">
          <TableCell :colspan="columns.length">
            <DataTableAddRow :table="table" />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
</template>
