<script setup lang="ts">
import { taskColumns } from "~/components/columns";
import Toaster from "~/components/ui/toast/Toaster.vue";
import type { TaskProps } from "~/types/types";

definePageMeta({
  middleware: "auth",
});

const { data: tasks, error } = await useFetch<TaskProps[]>(
  "http://localhost:5000/tasks",
  {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }
);

const data = ref(tasks.value || []);

const handleDeleteRow = (rowId: number) => {
  data.value = data.value.filter((item) => item._id !== rowId);
};

const handleAddRow = (newTask: TaskProps) => {
  data.value = [...data.value, newTask];
};

const handleUpdate = (updatedData: TaskProps[]) => {
  data.value = updatedData;
};
</script>
<template>
  <Toaster />
  <div class="flex items-start justify-center h-full">
    <div v-if="data" class="container">
      <DataTable
        :columns="taskColumns"
        :data="data"
        @delete-row="handleDeleteRow"
        @add-row="handleAddRow"
        @update-row="handleUpdate"
      />
    </div>
  </div>
</template>
